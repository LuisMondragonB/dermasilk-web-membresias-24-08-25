import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  CreditCard, 
  Gift, 
  Settings,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Award,
  LogOut
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  points?: number;
  created_at: string;
}

interface Membership {
  id: string;
  client_id: string;
  category: string;
  plan: string;
  areas: string[];
  monthly_payment: number;
  total_sessions: number;
  completed_sessions: number;
  status: string;
  start_date: string;
  next_payment_date?: string;
  created_at: string;
}

interface RewardTransaction {
  id: string;
  client_id: string;
  points: number;
  transaction_type: 'earned' | 'redeemed';
  reason: string;
  description?: string;
  created_at: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [rewardTransactions, setRewardTransactions] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Estados para el formulario de nuevo cliente
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Estados para el formulario de edición
  const [editClient, setEditClient] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Estados para membresías
  const [showNewMembershipModal, setShowNewMembershipModal] = useState(false);
  const [newMembership, setNewMembership] = useState({
    client_id: '',
    category: 'medianas',
    plan: 'completa',
    areas: [] as string[],
    monthly_payment: 0,
    total_sessions: 9,
    start_date: new Date().toISOString().split('T')[0],
    next_payment_date: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar clientes
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) {
        console.error('Error loading clients:', clientsError);
      } else {
        setClients(clientsData || []);
      }

      // Cargar membresías
      const { data: membershipsData, error: membershipsError } = await supabase
        .from('client_memberships')
        .select('*')
        .order('created_at', { ascending: false });

      if (membershipsError) {
        console.error('Error loading memberships:', membershipsError);
      } else {
        setMemberships(membershipsData || []);
      }

      // Cargar transacciones de puntos
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (rewardsError) {
        console.error('Error loading rewards:', rewardsError);
      } else {
        setRewardTransactions(rewardsData || []);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClient.name || !newClient.email) {
      alert('Nombre y email son obligatorios');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone || null,
          points: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        alert('Error al crear cliente: ' + error.message);
        return;
      }

      // Actualizar la lista de clientes
      setClients(prev => [data, ...prev]);
      
      // Limpiar formulario y cerrar modal
      setNewClient({ name: '', email: '', phone: '' });
      setShowNewClientModal(false);
      
      alert('Cliente creado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al crear cliente');
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setEditClient({
      name: client.name,
      email: client.email,
      phone: client.phone || ''
    });
    setShowEditClientModal(true);
  };
  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // Aquí puedes agregar lógica de logout si tienes autenticación
      navigate('/');
    }
  };


  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editClient.name || !editClient.email || !editingClient) {
      alert('Nombre y email son obligatorios');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: editClient.name,
          email: editClient.email,
          phone: editClient.phone || null
        })
        .eq('id', editingClient.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating client:', error);
        alert('Error al actualizar cliente: ' + error.message);
        return;
      }

      // Actualizar la lista de clientes
      setClients(prev => prev.map(client => 
        client.id === editingClient.id ? data : client
      ));
      
      // Limpiar formulario y cerrar modal
      setEditClient({ name: '', email: '', phone: '' });
      setEditingClient(null);
      setShowEditClientModal(false);
      
      alert('Cliente actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al actualizar cliente');
    }
  };

  const handleDeleteClient = async (client: Client) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${client.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id);

      if (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar cliente: ' + error.message);
        return;
      }

      // Actualizar la lista de clientes
      setClients(prev => prev.filter(c => c.id !== client.id));
      
      alert('Cliente eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al eliminar cliente');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas del dashboard
  const stats = {
    totalClients: clients.length,
    activeMemberships: memberships.filter(m => m.status === 'active').length,
    totalRevenue: memberships.reduce((sum, m) => sum + Number(m.monthly_payment), 0),
    totalPoints: rewardTransactions.reduce((sum, t) => 
      sum + (t.transaction_type === 'earned' ? t.points : -t.points), 0
    )
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37b7ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <span className="text-sm text-gray-500">Dermasilk®</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNewClientModal(true)}
                className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors duration-200 flex items-center space-x-2"
              >
                <UserPlus size={20} />
                <span>Nuevo Cliente</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'clients', name: 'Clientes', icon: Users },
              { id: 'memberships', name: 'Membresías', icon: CreditCard },
              { id: 'rewards', name: 'Puntos', icon: Gift },
              { id: 'settings', name: 'Configuración', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#37b7ff] text-[#37b7ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Membresías Activas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeMemberships}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Gift className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
              </div>
              <div className="p-6">
                {clients.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
                ) : (
                  <div className="space-y-4">
                    {clients.slice(0, 5).map((client) => (
                      <div key={client.id} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#37b7ff] rounded-full flex items-center justify-center">
                          <Users className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Nuevo cliente: {client.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(client.created_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowNewClientModal(true)}
                className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors duration-200 flex items-center space-x-2"
              >
                <UserPlus size={20} />
                <span>Nuevo Cliente</span>
              </button>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Clientes ({filteredClients.length})
                </h3>
              </div>
              
              {filteredClients.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ? 'No se encontraron clientes con ese término de búsqueda' : 'Comienza agregando tu primer cliente'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowNewClientModal(true)}
                      className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors duration-200 flex items-center space-x-2 mx-auto"
                    >
                      <UserPlus size={20} />
                      <span>Agregar Primer Cliente</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Puntos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registro
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-[#37b7ff] rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {client.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {client.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.email}</div>
                            {client.phone && (
                              <div className="text-sm text-gray-500">{client.phone}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="text-yellow-400 mr-1" size={16} />
                              <span className="text-sm font-medium text-gray-900">
                                {client.points || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(client.created_at).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleEditClient(client)}
                              className="text-[#37b7ff] hover:text-[#2da7ef] mr-3"
                              title="Editar cliente"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClient(client)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar cliente"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === 'memberships' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CreditCard className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Membresías</p>
                    <p className="text-2xl font-bold text-gray-900">{memberships.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Activas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {memberships.filter(m => m.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pausadas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {memberships.filter(m => m.status === 'paused').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completadas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {memberships.filter(m => m.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <DollarSign className="text-indigo-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ingresos/Mes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${memberships.filter(m => m.status === 'active').reduce((sum, m) => sum + Number(m.monthly_payment), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Memberships Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Membresías ({memberships.length})
                </h3>
                <button
                  onClick={() => alert('Funcionalidad de nueva membresía en desarrollo')}
                  className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors duration-200 flex items-center space-x-2"
                >
                  <CreditCard size={20} />
                  <span>Nueva Membresía</span>
                </button>
              </div>
              
              {memberships.length === 0 ? (
                <div className="p-12 text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay membresías</h3>
                  <p className="text-gray-500 mb-6">
                    Comienza creando la primera membresía para un cliente
                  </p>
                  <button
                    onClick={() => alert('Funcionalidad de nueva membresía en desarrollo')}
                    className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <CreditCard size={20} />
                    <span>Crear Primera Membresía</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Áreas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progreso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pago
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {memberships.map((membership) => {
                        const client = clients.find(c => c.id === membership.client_id);
                        const progress = (membership.completed_sessions / membership.total_sessions) * 100;
                        
                        return (
                          <tr key={membership.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-[#37b7ff] rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    {client?.name?.charAt(0).toUpperCase() || '?'}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {client?.name || 'Cliente no encontrado'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {client?.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {membership.plan}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {membership.category}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {membership.areas.slice(0, 2).map((area, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {area}
                                  </span>
                                ))}
                                {membership.areas.length > 2 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    +{membership.areas.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {membership.completed_sessions}/{membership.total_sessions}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                  className="bg-[#37b7ff] h-2 rounded-full"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                ${Number(membership.monthly_payment).toLocaleString()}/mes
                              </div>
                              <div className="text-sm text-gray-500">
                                {membership.next_payment_date ? 
                                  new Date(membership.next_payment_date).toLocaleDateString('es-ES') : 
                                  'No programado'
                                }
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                membership.status === 'active' ? 'bg-green-100 text-green-800' :
                                membership.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                membership.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {membership.status === 'active' ? 'Activa' :
                                 membership.status === 'paused' ? 'Pausada' :
                                 membership.status === 'completed' ? 'Completada' :
                                 'Cancelada'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => alert('Funcionalidad de edición en desarrollo')}
                                className="text-[#37b7ff] hover:text-[#2da7ef] mr-3"
                                title="Editar membresía"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => alert('Funcionalidad de eliminación en desarrollo')}
                                className="text-red-600 hover:text-red-900"
                                title="Eliminar membresía"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sistema de Puntos</h3>
            <p className="text-gray-500">Gestión de puntos y recompensas - En desarrollo</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración</h3>
            <p className="text-gray-500">Configuración del sistema - En desarrollo</p>
          </div>
        )}
      </main>

      {/* Modal para Nuevo Cliente */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Cliente</h3>
            
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                  placeholder="443 123 4567"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewClientModal(false);
                    setNewClient({ name: '', email: '', phone: '' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#37b7ff] text-white rounded-lg hover:bg-[#2da7ef] transition-colors duration-200"
                >
                  Crear Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar Cliente */}
      {showEditClientModal && editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Editar Cliente: {editingClient.name}
            </h3>
            
            <form onSubmit={handleUpdateClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={editClient.name}
                  onChange={(e) => setEditClient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={editClient.email}
                  onChange={(e) => setEditClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={editClient.phone}
                  onChange={(e) => setEditClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                  placeholder="443 123 4567"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditClientModal(false);
                    setEditingClient(null);
                    setEditClient({ name: '', email: '', phone: '' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#37b7ff] text-white rounded-lg hover:bg-[#2da7ef] transition-colors duration-200"
                >
                  Actualizar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Nueva Membresía */}
      {showNewMembershipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Membresía</h3>
            
            <form onSubmit={handleCreateMembership} className="space-y-6">
              {/* Selección de Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <select
                  required
                  value={newMembership.client_id}
                  onChange={(e) => setNewMembership(prev => ({ ...prev, client_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(membershipCategories).map(([key, category]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateMembershipPricing(key, newMembership.plan)}
                      className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                        newMembership.category === key
                          ? 'border-[#37b7ff] bg-[#37b7ff]/10 text-[#37b7ff]'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium text-sm">{category.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(membershipCategories[newMembership.category as keyof typeof membershipCategories].plans).map(([planKey, planData]) => (
                    <button
                      key={planKey}
                      type="button"
                      onClick={() => updateMembershipPricing(newMembership.category, planKey)}
                      className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                        newMembership.plan === planKey
                          ? 'border-[#37b7ff] bg-[#37b7ff]/10 text-[#37b7ff]'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium text-sm capitalize">{planKey}</div>
                      <div className="text-xs text-gray-500">${planData.monthly}/mes</div>
                      <div className="text-xs text-gray-500">{planData.sessions} sesiones</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Áreas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Áreas a tratar *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {membershipCategories[newMembership.category as keyof typeof membershipCategories].areas.map((area) => (
                    <label key={area} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMembership.areas.includes(area)}
                        onChange={() => handleAreaToggle(area)}
                        className="rounded border-gray-300 text-[#37b7ff] focus:ring-[#37b7ff]"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Seleccionadas: {newMembership.areas.length}
                </p>
              </div>

              {/* Resumen */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Resumen de la Membresía</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="capitalize">{newMembership.plan} - {membershipCategories[newMembership.category as keyof typeof membershipCategories].title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pago mensual:</span>
                    <span className="font-medium">${newMembership.monthly_payment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total sesiones:</span>
                    <span>{newMembership.total_sessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Áreas seleccionadas:</span>
                    <span>{newMembership.areas.length}</span>
                  </div>
                </div>
              </div>

              {/* Fecha de inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={newMembership.start_date}
                  onChange={(e) => setNewMembership(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewMembershipModal(false);
                    setNewMembership({
                      client_id: '',
                      category: 'medianas',
                      plan: 'completa',
                      areas: [],
                      monthly_payment: 0,
                      total_sessions: 9,
                      start_date: new Date().toISOString().split('T')[0],
                      next_payment_date: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#37b7ff] text-white rounded-lg hover:bg-[#2da7ef] transition-colors duration-200"
                >
                  Crear Membresía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;