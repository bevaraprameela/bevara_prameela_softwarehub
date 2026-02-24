import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import api from "../../api/client.js";
import { io } from "socket.io-client";

function MyProjects() {
  const [list, setList] = useState([]);
  const load = async () => {
    const res = await api.get("/projects");
    setList(res.data);
  };
  const setStatus = async (id, status) => {
    await api.put(`/projects/${id}/status`, { status });
    load();
  };
  useEffect(() => { load(); }, []);
  return (
    <ul className="space-y-2">
      {list.map(p=>(
        <li key={p._id} className="p-3 border rounded flex items-center justify-between">
          <div>
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-600">Status: {p.status}</div>
          </div>
          <select value={p.status} onChange={(e)=>setStatus(p._id, e.target.value)} className="border rounded p-2">
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </li>
      ))}
    </ul>
  );
}

function Messages() {
  const [otherId, setOtherId] = useState("");
  const [email, setEmail] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [thread, setThread] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const load = async () => {
    const id = (otherId || "").trim();
    if (!id) return;
    const res = await api.get(`/messages/${id}`);
    setThread(res.data);
    await api.put(`/messages/${id}/read`);
    loadThreads();
  };
  const loadThreads = async () => {
    setLoadingThreads(true);
    try {
      const res = await api.get("/messages/threads");
      setThreads(res.data);
    } finally {
      setLoadingThreads(false);
    }
  };
  const findByEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    const res = await api.get(`/user-lookup?email=${encodeURIComponent(email)}`);
    setRecipient(res.data);
    setOtherId(res.data._id);
    load();
  };
  const send = async (e) => {
    e.preventDefault();
    const id = (otherId || "").trim();
    if (!id || !text) return;
    setError(null);
    try {
      await api.post("/messages", { receiverId: id, text });
      setText("");
      load();
      loadThreads();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to send message";
      setError(msg);
    }
  };
  useEffect(() => { loadThreads(); }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const base = new URL(api.defaults.baseURL).origin;
    const socket = io(base, { auth: { token } });
    socket.on("message:new", (m) => {
      if (m.sender === otherId || m.receiver === otherId) {
        setThread((prev) => [...prev, m]);
      }
    });
    socket.on("threads:update", () => {
      loadThreads();
    });
    return () => { socket.close(); };
  }, [otherId]);
  return (
    <div className="grid grid-cols-5 gap-4">
      <aside className="col-span-2 border rounded p-3 space-y-2">
        <div className="font-medium">Recent Conversations</div>
        {loadingThreads ? <div className="text-sm text-gray-600">Loading…</div> : (
          <ul className="space-y-1">
            {threads.map(t => (
              <li key={t.otherId} className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${otherId===t.otherId ? "bg-gray-100" : ""}`} onClick={()=>{ setOtherId(t.otherId); setRecipient(t.user); load(); }}>
                <div className="font-medium flex items-center justify-between">
                  <span>{t.user.name} <span className="text-xs text-gray-600">({t.user.role})</span></span>
                  {t.unread > 0 && <span className="ml-2 inline-flex items-center justify-center text-xs bg-red-600 text-white rounded-full w-5 h-5">{t.unread}</span>}
                </div>
                <div className="text-xs text-gray-600 truncate">{t.lastText}</div>
              </li>
            ))}
            {threads.length===0 && <li className="text-sm text-gray-600">No conversations yet</li>}
          </ul>
        )}
      </aside>
      <main className="col-span-3 space-y-3">
        <form onSubmit={findByEmail} className="flex items-center space-x-2">
          <input className="border p-2 rounded w-64" placeholder="Find by email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <button className="px-3 py-2 bg-gray-800 text-white rounded">Find</button>
          <span className="text-sm text-gray-600">{recipient ? `To: ${recipient.name} (${recipient.role})` : ""}</span>
        </form>
        <form onSubmit={send} className="flex items-center space-x-2">
          <input className="border p-2 rounded w-64" placeholder="Other User ID" value={otherId} onChange={(e)=>setOtherId(e.target.value)} />
          <input className="border p-2 rounded flex-1" placeholder="Message" value={text} onChange={(e)=>setText(e.target.value)} />
          <button className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
          <button type="button" onClick={load} className="px-3 py-2 bg-gray-300 rounded">Refresh</button>
        </form>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <ul className="space-y-2">
          {thread.map(m=>(
            <li key={m._id} className="p-2 border rounded">{m.text}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}

function Profile() {
  const [form, setForm] = useState({ name: "", companyName: "", profile: { phone: "", title: "", bio: "" } });
  const [userId, setUserId] = useState("");
  const load = async () => {
    const me = await api.get("/auth/me");
    setForm({
      name: me.data.user.name || "",
      companyName: me.data.user.companyName || "",
      profile: {
        phone: me.data.user.profile?.phone || "",
        title: me.data.user.profile?.title || "",
        bio: me.data.user.profile?.bio || ""
      }
    });
    setUserId(me.data.user._id);
  };
  const save = async (e) => {
    e.preventDefault();
    await api.put("/auth/profile", form);
    load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-600">Your User ID:</span>
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userId}</span>
        <button className="px-2 py-1 text-xs bg-gray-200 rounded" onClick={()=>{navigator.clipboard?.writeText(userId)}}>Copy</button>
      </div>
      <form onSubmit={save} className="grid grid-cols-2 gap-2">
        <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Company" value={form.companyName} onChange={(e)=>setForm({...form,companyName:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Phone" value={form.profile.phone} onChange={(e)=>setForm({...form,profile:{...form.profile,phone:e.target.value}})}/>
        <input className="border p-2 rounded" placeholder="Title" value={form.profile.title} onChange={(e)=>setForm({...form,profile:{...form.profile,title:e.target.value}})}/>
        <textarea className="border p-2 rounded col-span-2" placeholder="Bio" value={form.profile.bio} onChange={(e)=>setForm({...form,profile:{...form.profile,bio:e.target.value}})} />
        <button className="px-3 py-2 bg-blue-600 text-white rounded w-32">Save</button>
      </form>
    </div>
  );
}

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen grid grid-cols-5">
      <aside className="col-span-1 bg-gray-900 text-white p-4 space-y-2">
        <div className="text-xl font-semibold">Employee</div>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="">Projects</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="messages">Messages</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="profile">Profile</Link>
      </aside>
      <main className="col-span-4 p-6 space-y-6">
        <Routes>
          <Route index element={<MyProjects />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}
