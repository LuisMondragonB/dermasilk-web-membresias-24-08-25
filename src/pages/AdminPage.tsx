import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
const supabaseUrl = 'https://zlrjpsrrggolxlwgtyou.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpscmpwc3JyZ2dvbHhsd2d0eW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1Mjk4MzAsImV4cCI6MjA2ODEwNTgzMH0.ijDIFrn1Jr3jRAdXkfMmkE0ehEq2luFKqeGyvIUL7Dc';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// --- ÍCONOS SVG ---
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- DATOS DEL NEGOCIO ---
const membershipData = {
    grandes: { name: "Áreas Grandes", zones: "Piernas Completas, Brazos, Espalda", plans: { esencial: { name: "Esencial", price: 800, sessions: 6 }, completa: { name: "Completa", price: 675, sessions: 9 }, platinum: { name: "Platinum", price: 575, sessions: 12 }}},
    medianas: { name: "Áreas Medianas", zones: "Abdomen, 1/2 Piernas, 1/2 Brazos, Rostro, Bikini, Glúteos, Pecho, Hombros, 1/2 Espalda, Axilas", plans: { esencial: { name: "Esencial", price: 600, sessions: 6 }, completa: { name: "Completa", price: 500, sessions: 9 }, platinum: { name: "Platinum", price: 425, sessions: 12 }}},
    chicas: { name: "Áreas Chicas", zones: "Manos, Pies, Líneas, Bigote, Pómulos, Mentón, Areolas, Patillas, Cuello, Nuca", plans: { esencial: { name: "Esencial", price: 400, sessions: 6 }, completa: { name: "Completa", price: 335, sessions: 9 }, platinum: { name: "Platinum", price: 285, sessions: 12 }}}
};

// --- COMPONENTES DE LA APLICACIÓN ---

const Modal = ({ children, isOpen, onClose, title }: { children: React.ReactNode, isOpen: boolean, onClose: () => void, title: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><XIcon /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const ClientForm = ({ onClientAdded, existingClient, onClientUpdated }: { onClientAdded: () => void, existingClient: any, onClientUpdated: () => void }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (existingClient) {
            setName(existingClient.name);
            setEmail(existingClient.email);
            setPhone(existingClient.phone);
        } else {
            setName(''); setEmail(''); setPhone('');
        }
    }, [existingClient]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone) { setError('Todos los campos son obligatorios.'); return; }
        setIsLoading(true); setError('');
        
        try {
            const clientData = { name, email, phone };
            let result;
            if (existingClient) {
                result = await supabaseClient.from('clients').update(clientData).eq('id', existingClient.id);
            } else {
                result = await supabaseClient.from('clients').insert([clientData]);
            }
            if (result.error) throw result.error;
            if (existingClient) onClientUpdated(); else onClientAdded();
        } catch (err: any) {
            console.error("Error al guardar cliente: ", err);
            setError(`Hubo un error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-style" placeholder="Nombre Completo" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-style" placeholder="Correo Electrónico" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-style" placeholder="Teléfono" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Guardando...' : (existingClient ? 'Actualizar Cliente' : 'Agregar Cliente')}
            </button>
        </form>
    );
};

// ... (El resto de los componentes como MembershipForm, AppointmentScheduler, etc. irían aquí, adaptados a TypeScript)
// Por brevedad, se omiten los componentes internos que no cambian su lógica fundamental.
// El código completo se puede copiar del HTML anterior y adaptar los props a TS.

const Dashboard = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchClients = async () => {
        const { data, error } = await supabaseClient.from('clients').select('*').order('created_at', { ascending: false });
        if (error) console.error("Error al obtener clientes:", error);
        else setClients(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchClients();
        const clientSubscription = supabaseClient
            .channel('public:clients')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
                fetchClients();
            })
            .subscribe();
        return () => { supabaseClient.removeChannel(clientSubscription) };
    }, []);

    const handleClientAdded = () => { setModalOpen(false); setEditingClient(null); };
    const handleClientUpdated = () => { setModalOpen(false); setEditingClient(null); };
    const handleEditClient = (client: any) => { setEditingClient(client); setModalOpen(true); };
    
    const handleDeleteClient = async (clientId: string) => {
        if (window.confirm("¿Seguro que quieres eliminar este cliente?")) {
            const { error } = await supabaseClient.from('clients').delete().eq('id', clientId);
            if (error) console.error("Error al eliminar cliente:", error);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (selectedClient) {
        // ClientDetails component would be rendered here
        return <div>Detalles del Cliente (Componente a implementar)</div>;
    }

    return (
        <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Panel de Dermasilk</h1>
                    <button onClick={() => { setEditingClient(null); setModalOpen(true); }} className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105">
                        <UserPlusIcon /><span>Agregar Cliente</span>
                    </button>
                </div>
                <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6" />
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {loading ? <p className="p-10 text-center text-gray-500">Cargando...</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Nombre</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Contacto</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Puntos</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredClients.map(client => (
                                        <tr key={client.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedClient(client)}>
                                            <td className="px-6 py-4"><span className="font-medium text-gray-900">{client.name}</span></td>
                                            <td className="px-6 py-4"><div className="text-sm text-gray-500">{client.email}</div><div className="text-sm text-gray-500">{client.phone}</div></td>
                                            <td className="px-6 py-4"><span className="font-bold text-blue-600">{client.points || 0}</span></td>
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-4">
                                                    <button onClick={() => handleEditClient(client)} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                                    <button onClick={() => handleDeleteClient(client.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => { setModalOpen(false); setEditingClient(null); }} title={editingClient ? "Editar Cliente" : "Agregar Cliente"}>
                <ClientForm onClientAdded={handleClientAdded} existingClient={editingClient} onClientUpdated={handleClientUpdated} />
            </Modal>
        </div>
    );
};

const LoginScreen = ({ onLogin }: { onLogin: () => void}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); setError('');
        try {
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            onLogin();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
         <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Dermasilk Admin</h1>
                    <p className="text-gray-500">Inicia sesión</p>
                </div>
                <form onSubmit={handleAuth} className="space-y-4">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="input-style" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required className="input-style" />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};


export default function AdminPage() {
    const [session, setSession] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
    }

    return session ? <Dashboard /> : <LoginScreen onLogin={() => supabaseClient.auth.getSession().then(({data}) => setSession(data.session))} />;
}
