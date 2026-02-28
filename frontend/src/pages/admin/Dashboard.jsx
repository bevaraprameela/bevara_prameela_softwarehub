import { useEffect, useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";
import { Outlet,Link } from "react-router-dom";
import api from "../../api/client.js";
import { io } from "socket.io-client";

function Employees() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Employee", companyName: "" });
  const [error, setError] = useState(null);
  const load = async () => {
    const res = await api.get("/users?role=Employee");
    setList(res.data);
  };
  const create = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (!form.password || form.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      await api.post("/auth/create-user", form);
      setForm({ name: "", email: "", password: "", role: "Employee", companyName: "" });
      load();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.errors?.map(x=>x.msg).join(", ") || "Failed to create employee";
      setError(msg);
    }
  };
  const remove = async (id) => {
    await api.delete(`/users/${id}`);
    load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Employees</h3>
      <form onSubmit={create} className="grid grid-cols-5 gap-2">
        <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Password (min 6 chars)" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Company" value={form.companyName} onChange={(e)=>setForm({...form,companyName:e.target.value})}/>
        <button className="bg-blue-600 text-white rounded">Create</button>
      </form>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2"></th></tr></thead>
        <tbody>
          {list.map(u=>(
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 text-right"><button onClick={()=>remove(u._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminOverview() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/service-requests");
      const list = res.data || [];
      setPending(list.filter(r => r.approvalStatus === "Pending"));
    } finally {
      setLoading(false);
    }
  };
  const approve = async (id) => {
    await api.put(`/service-requests/${id}/approval`, { status: "Approved" });
    load();
  };
  const reject = async (id) => {
    let payload = { status: "Rejected" };
    const reason = window.prompt("Please enter a brief reason to send to the client:");
    if (reason !== null) {
      payload.reason = reason;
    }
    await api.put(`/service-requests/${id}/approval`, payload);
    load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pending Service Requests</h3>
        <Link to="requests" className="text-blue-700 underline">View all</Link>
      </div>
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : pending.length === 0 ? (
        <div className="p-4 border rounded bg-gray-50 text-gray-700">
          No pending requests. Create services and have a Client submit a request from their dashboard.
        </div>
      ) : (
        <ul className="space-y-2">
          {pending.slice(0,5).map(r => (
            <li key={r._id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{r.service?.name || "Service"}</div>
                <div className="text-sm text-gray-600">Client: {r.client?.name}</div>
              </div>
              <div className="space-x-2">
                <button onClick={() => approve(r._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                <button onClick={() => reject(r._id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Clients() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Client", companyName: "" });
  const [error, setError] = useState(null);
  const load = async () => {
    const res = await api.get("/users?role=Client");
    setList(res.data);
  };
  const create = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (!form.password || form.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      await api.post("/auth/create-user", form);
      setForm({ name: "", email: "", password: "", role: "Client", companyName: "" });
      load();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.errors?.map(x=>x.msg).join(", ") || "Failed to create client";
      setError(msg);
    }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Clients</h3>
      <form onSubmit={create} className="grid grid-cols-5 gap-2">
        <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Password (min 6 chars)" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Company" value={form.companyName} onChange={(e)=>setForm({...form,companyName:e.target.value})}/>
        <button className="bg-blue-600 text-white rounded">Create</button>
      </form>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th></tr></thead>
        <tbody>
          {list.map(u=>(
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Services() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: 0 });
  const load = async () => {
    const res = await api.get("/services");
    setList(res.data);
  };
  const create = async (e) => {
    e.preventDefault();
    await api.post("/services", form);
    setForm({ name: "", description: "", price: 0 });
    load();
  };
  const remove = async (id) => {
    await api.delete(`/services/${id}`);
    load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Services</h3>
      <form onSubmit={create} className="grid grid-cols-4 gap-2">
        <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Price" type="number" value={form.price} onChange={(e)=>setForm({...form,price:Number(e.target.value)})}/>
        <button className="bg-blue-600 text-white rounded">Create</button>
      </form>
      <ul className="space-y-2">
        {list.map(s=>(
          <li key={s._id} className="p-3 border rounded flex items-center justify-between">
            <div>{s.name}</div>
            <button onClick={()=>remove(s._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ServiceRequests() {
  const [list, setList] = useState([]);
  const [info, setInfo] = useState(null);
  const load = async () => {
    const res = await api.get("/service-requests");
    setList(res.data);
  };
  const setApproval = async (id, status) => {
    let payload = { status };
    if (status === "Rejected") {
      const reason = window.prompt("Please enter a brief reason to send to the client:");
      if (reason !== null) {
        payload.reason = reason;
      }
    }
    const res = await api.put(`/service-requests/${id}/approval`, payload);
    if (status === "Approved" && res.data?.project?._id) {
      setInfo("Request approved and project created");
    } else if (status === "Rejected") {
      setInfo("Request rejected and client notified");
    } else {
      setInfo("Action completed");
    }
    load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Service Requests</h3>
      {info && <div className="text-green-700 text-sm">{info}</div>}
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="p-2 text-left">Client</th><th className="p-2 text-left">Service</th><th className="p-2 text-left">Status</th><th className="p-2"></th></tr></thead>
        <tbody>
          {list.map(r=>(
            <tr key={r._id} className="border-t">
              <td className="p-2">{r.client?.name}</td>
              <td className="p-2">{r.service?.name}</td>
              <td className="p-2">{r.approvalStatus}</td>
              <td className="p-2 space-x-2">
                <button onClick={()=>setApproval(r._id,"Approved")} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                <button onClick={()=>setApproval(r._id,"Rejected")} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-sm text-gray-600">Approving creates a project automatically</div>
    </div>
  );
}

function Projects() {
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assigning, setAssigning] = useState(null);
  const [selected, setSelected] = useState([]);
  const load = async () => {
    const res = await api.get("/projects");
    setList(res.data);
    const e = await api.get("/users?role=Employee");
    setEmployees(e.data);
  };
  const saveAssign = async () => {
    await api.put(`/projects/${assigning}/assign`, { employeeIds: selected });
    setAssigning(null);
    setSelected([]);
    load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Projects</h3>
      <ul className="space-y-2">
        {list.map(p=>(
          <li key={p._id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">Status: {p.status}</div>
              <div className="text-sm text-gray-600">Employees: {p.assignedEmployees?.map(e=>e.name).join(", ")}</div>
            </div>
            <button onClick={()=>{setAssigning(p._id); setSelected(p.assignedEmployees?.map(e=>e._id)||[]);}} className="px-3 py-1 bg-blue-600 text-white rounded">Assign</button>
          </li>
        ))}
      </ul>
      {assigning && (
        <div className="p-4 border rounded space-y-2">
          <div className="font-medium">Assign Employees</div>
          <div className="grid grid-cols-3 gap-2">
            {employees.map(e=>(
              <label key={e._id} className="flex items-center space-x-2">
                <input type="checkbox" checked={selected.includes(e._id)} onChange={(ev)=> {
                  if (ev.target.checked) setSelected([...selected, e._id]);
                  else setSelected(selected.filter(id=>id!==e._id));
                }} />
                <span>{e.name}</span>
              </label>
            ))}
          </div>
          <div className="space-x-2">
            <button onClick={saveAssign} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
            <button onClick={()=>{setAssigning(null); setSelected([]);}} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
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
      <h3 className="text-lg font-semibold">Profile</h3>
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

export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState(0);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/service-requests");
        const list = res.data || [];
        setPendingCount(list.filter(r => r.approvalStatus === "Pending").length);
      } catch {}
    })();
  }, []);
    return (
    <div className="min-h-screen grid grid-cols-5">
      <aside className="col-span-1 bg-gray-900 text-white p-4 space-y-2">
        <div className="text-xl font-semibold">Admin</div>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="">Overview</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="employees">Employees</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="clients">Clients</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="services">Services</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800 flex items-center justify-between" to="requests">
          <span>Service Requests</span>
          <span className="ml-2 inline-flex items-center justify-center min-w-6 h-6 px-2 text-xs rounded-full bg-yellow-500 text-black">{pendingCount}</span>
        </Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="projects">Projects</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="messages">Messages</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-800" to="profile">Profile</Link>
      </aside>
      <main className="col-span-4 p-6 space-y-6">
        {/* <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="employees" element={<Employees />} />
          <Route path="clients" element={<Clients />} />
          <Route path="services" element={<Services />} />
          <Route path="requests" element={<ServiceRequests />} />
          <Route path="projects" element={<Projects />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Routes> */}
          <Outlet />
      </main>
    </div>
  );
}
