import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, 
  CreditCard, 
  Gift, 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  Crown,
  Zap,
  TrendingUp,
  DollarSign,
  Award,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play
} from 'lucide-react';

// Configuración de Supabase
const supabaseUrl = 'https://zlrjpsrrggolxlwgtyou.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpscmpwc3JyZ2dvbHhsd2d0eW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1Mjk4MzAsImV4cCI6MjA2ODEwNTgzMH0.ijDIFrn1Jr3jRAdXkfMmkE0ehEq2luFKqeGyvIUL7Dc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Datos de membresías
const membershipData = {
  grandes: {
    name: "Áreas Grandes",
    zones: ["Piernas Completas", "Brazos", "Espalda"],
    plans: {
      esencial: { name: "Esencial", price: 800, sessions: 6 },
      completa: { name: "Completa", price: 675, sessions: 9 },
      platinum: { name: "Platinum", price: 575, sessions: 12 }
    }
  },
  medianas: {
    name: "Áreas Medianas", 
    zones: ["Abdomen", "1/2 Piernas", "1/2 Brazos", "Rostro", "Bikini", "Glúteos", "Pecho", "Hombros", "1/2 Espalda", "Axilas"],
    plans: {
      esencial: { name: "Esencial", price: 600, sessions: 6 },
      completa: { name: "Completa", price: 500, sessions: 9 },
      platinum: { name: "Platinum", price: 425, sessions: 12 }
    }
  },
  chicas: {
    name: "Áreas Chicas",
    zones: ["Manos", "Pies", "Líneas", "Bigote", "Pómulos", "Mentón", "Areolas", "Patillas", "Cuello", "Nuca"],
    plans: {
      esencial: { name: "Esencial", price: 400, sessions: 6 },
      completa: { name: "Completa", price: 335, sessions: 9 },
      platinum: { name: "Platinum", price: 285, sessions: 12 }
    }
  }
};

// Componente Modal
const Modal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Componente para agregar/editar cliente
const ClientForm = ({ client, onSave, onCancel }: {
  client?: any;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    points: client?.points || 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Enviando datos del cliente:', formData); // Debug

    try {
      if (client) {
        console.log('Actualizando cliente existente:', client.id);
        await supabase
          .from('clients')
          .update(formData)
          .eq('id', client.id);
      } else {
        console.log('Creando nuevo cliente');
        const { data, error } = await supabase
          .from('clients')
          .insert([formData]);
        
        if (error) {
          console.error('Error al crear cliente:', error);
          alert('Error al crear cliente: ' + error.message);
          return;
        }
        
        console.log('Cliente creado exitosamente:', data);
      }
      
      alert(client ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
      onSave();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error al guardar cliente: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre Completo
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Puntos de Recompensa
        </label>
        <input
          type="number"
          value={formData.points}
          onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
          min="0"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#37b7ff] text-white py-3 px-6 rounded-xl hover:bg-[#2da7ef] transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : (client ? 'Actualizar' : 'Crear Cliente')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

// Componente para crear membresía
const MembershipForm = ({ client, onSave, onCancel }: {
  client: any;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    category: 'medianas',
    plan: 'completa',
    areas: [] as string[],
    customAreas: '',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const selectedCategory = membershipData[formData.category as keyof typeof membershipData];
  const selectedPlan = selectedCategory.plans[formData.plan as keyof typeof selectedCategory.plans];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const areas = formData.customAreas 
        ? formData.customAreas.split(',').map(area => area.trim())
        : formData.areas;

      const nextPaymentDate = new Date(formData.startDate);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      await supabase
        .from('client_memberships')
        .insert([{
          client_id: client.id,
          category: formData.category,
          plan: formData.plan,
          areas: areas,
          monthly_payment: selectedPlan.price,
          total_sessions: selectedPlan.sessions,
          start_date: formData.startDate,
          next_payment_date: nextPaymentDate.toISOString().split('T')[0]
        }]);

      onSave();
    } catch (error) {
      console.error('Error creating membership:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-2">Cliente: {client.name}</h4>
        <p className="text-sm text-gray-600">{client.email} • {client.phone}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría de Área
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
        >
          {Object.entries(membershipData).map(([key, category]) => (
            <option key={key} value={key}>{category.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plan
        </label>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(selectedCategory.plans).map(([key, plan]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFormData({ ...formData, plan: key })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.plan === key
                  ? 'border-[#37b7ff] bg-[#37b7ff]/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold capitalize">{key}</div>
                <div className="text-[#37b7ff] font-bold">${plan.price}/mes</div>
                <div className="text-sm text-gray-600">{plan.sessions} sesiones</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Áreas Disponibles
        </label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {selectedCategory.zones.map((zone) => (
            <label key={zone} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.areas.includes(zone)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, areas: [...formData.areas, zone] });
                  } else {
                    setFormData({ ...formData, areas: formData.areas.filter(a => a !== zone) });
                  }
                }}
                className="rounded border-gray-300 text-[#37b7ff] focus:ring-[#37b7ff]"
              />
              <span className="text-sm">{zone}</span>
            </label>
          ))}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            O especifica áreas personalizadas (separadas por comas)
          </label>
          <input
            type="text"
            value={formData.customAreas}
            onChange={(e) => setFormData({ ...formData, customAreas: e.target.value })}
            placeholder="Ej: Piernas completas, Axilas, Bigote"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de Inicio
        </label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
          required
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-2">Resumen de la Membresía</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Plan:</span>
            <span className="font-semibold capitalize">{formData.plan}</span>
          </div>
          <div className="flex justify-between">
            <span>Pago mensual:</span>
            <span className="font-semibold text-[#37b7ff]">${selectedPlan.price}</span>
          </div>
          <div className="flex justify-between">
            <span>Total de sesiones:</span>
            <span className="font-semibold">{selectedPlan.sessions}</span>
          </div>
          <div className="flex justify-between">
            <span>Áreas seleccionadas:</span>
            <span className="font-semibold">{formData.customAreas || formData.areas.length}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading || (formData.areas.length === 0 && !formData.customAreas)}
          className="flex-1 bg-[#37b7ff] text-white py-3 px-6 rounded-xl hover:bg-[#2da7ef] transition-colors disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear Membresía'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

// Componente para gestionar puntos
const PointsManager = ({ client, onSave, onCancel }: {
  client: any;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    points: 0,
    type: 'earned' as 'earned' | 'redeemed',
    reason: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [rewardsCatalog, setRewardsCatalog] = useState<any[]>([]);

  useEffect(() => {
    fetchRewardsCatalog();
  }, []);

  const fetchRewardsCatalog = async () => {
    const { data } = await supabase
      .from('rewards_catalog')
      .select('*')
      .eq('active', true)
      .order('points_required');
    
    if (data) setRewardsCatalog(data);
  };

  const predefinedReasons = {
    earned: [
      'Referir amigas',
      'Reseña 5 estrellas',
      'Fotos antes/después',
      'Completar membresía',
      'Bonus especial'
    ],
    redeemed: rewardsCatalog.map(reward => reward.name)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pointsChange = formData.type === 'earned' ? formData.points : -formData.points;
      const newTotal = client.points + pointsChange;

      if (newTotal < 0) {
        alert('El cliente no tiene suficientes puntos para este canje');
        return;
      }

      // Actualizar puntos del cliente
      await supabase
        .from('clients')
        .update({ points: newTotal })
        .eq('id', client.id);

      // Registrar transacción
      await supabase
        .from('rewards_transactions')
        .insert([{
          client_id: client.id,
          points: formData.points,
          transaction_type: formData.type,
          reason: formData.reason,
          description: formData.description
        }]);

      onSave();
    } catch (error) {
      console.error('Error managing points:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-2">Cliente: {client.name}</h4>
        <p className="text-sm text-gray-600">Puntos actuales: <span className="font-bold text-[#37b7ff]">{client.points}</span></p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Transacción
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'earned' })}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.type === 'earned'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Plus className="mx-auto mb-2 text-green-500" size={24} />
              <div className="font-semibold">Ganar Puntos</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'redeemed' })}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.type === 'redeemed'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Gift className="mx-auto mb-2 text-red-500" size={24} />
              <div className="font-semibold">Canjear Puntos</div>
            </div>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cantidad de Puntos
        </label>
        <input
          type="number"
          value={formData.points}
          onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
          min="1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Razón
        </label>
        <select
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
          required
        >
          <option value="">Selecciona una razón</option>
          {predefinedReasons[formData.type].map((reason) => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción (opcional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
          rows={3}
          placeholder="Detalles adicionales..."
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#37b7ff] text-white py-3 px-6 rounded-xl hover:bg-[#2da7ef] transition-colors disabled:opacity-50"
        >
          {loading ? 'Procesando...' : (formData.type === 'earned' ? 'Agregar Puntos' : 'Canjear Puntos')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

// Componente principal del Dashboard
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [clients, setClients] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'client' | 'membership' | 'points'>('client');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    console.log('Obteniendo datos de Supabase...');
    
    try {
      const [clientsRes, membershipsRes, appointmentsRes] = await Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('client_memberships').select(`
          *,
          clients (name, email, phone)
        `).order('created_at', { ascending: false }),
        supabase.from('appointments').select(`
          *,
          clients (name, email, phone)
        `).order('appointment_date', { ascending: false })
      ]);

      console.log('Respuesta de clientes:', clientsRes);
      console.log('Respuesta de membresías:', membershipsRes);
      console.log('Respuesta de citas:', appointmentsRes);

      if (clientsRes.data) setClients(clientsRes.data);
      if (membershipsRes.data) setMemberships(membershipsRes.data);
      if (appointmentsRes.data) setAppointments(appointmentsRes.data);
      
      console.log('Datos cargados - Clientes:', clientsRes.data?.length || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error al cargar datos: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedClient(null);
    fetchData();
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalClients: clients.length,
    activeMemberships: memberships.filter(m => m.status === 'active').length,
    monthlyRevenue: memberships
      .filter(m => m.status === 'active')
      .reduce((sum, m) => sum + m.monthly_payment, 0),
    totalPoints: clients.reduce((sum, c) => sum + (c.points || 0), 0)
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel Dermasilk®</h1>
              <p className="text-gray-600">Sistema de gestión de membresías y clientes</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setModalType('client');
                  setSelectedClient(null);
                  setShowModal(true);
                }}
                className="bg-[#37b7ff] text-white px-6 py-3 rounded-xl hover:bg-[#2da7ef] transition-colors flex items-center space-x-2 shadow-lg"
              >
                <UserPlus size={20} />
                <span>Nuevo Cliente</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Acciones rápidas:
              </div>
              <button
                onClick={() => {
                  setModalType('client');
                  setSelectedClient(null);
                  setShowModal(true);
                }}
                className="text-[#37b7ff] hover:text-[#2da7ef] text-sm font-medium flex items-center space-x-1"
              >
                <UserPlus size={16} />
                <span>Agregar Cliente</span>
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('es-MX', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Resumen', icon: TrendingUp },
              { id: 'clients', name: 'Clientes', icon: Users },
              { id: 'memberships', name: 'Membresías', icon: CreditCard },
              { id: 'appointments', name: 'Citas', icon: Calendar },
              { id: 'rewards', name: 'Recompensas', icon: Gift }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#37b7ff] text-[#37b7ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CreditCard className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Membresías Activas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeMemberships}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <DollarSign className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Award className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Membresías Recientes</h3>
                <div className="space-y-4">
                  {memberships.slice(0, 5).map((membership) => (
                    <div key={membership.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{membership.clients?.name}</p>
                        <p className="text-sm text-gray-600">
                          {membershipData[membership.category as keyof typeof membershipData]?.name} - {membership.plan}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#37b7ff]">${membership.monthly_payment}/mes</p>
                        <p className="text-sm text-gray-600">{membership.completed_sessions}/{membership.total_sessions} sesiones</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h3>
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.clients?.name}</p>
                        <p className="text-sm text-gray-600">{appointment.treatment_area}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.appointment_time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  setModalType('client');
                  setSelectedClient(null);
                  setShowModal(true);
                }}
                className="bg-[#37b7ff] text-white px-6 py-3 rounded-xl hover:bg-[#2da7ef] transition-colors flex items-center space-x-2 whitespace-nowrap"
              >
                <UserPlus size={20} />
                <span>Nuevo Cliente</span>
              </button>
            </div>

            {/* Debug Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Estado del Sistema</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Clientes cargados:</span>
                  <span className="font-bold ml-2">{clients.length}</span>
                </div>
                <div>
                  <span className="text-blue-700">Membresías:</span>
                  <span className="font-bold ml-2">{memberships.length}</span>
                </div>
                <div>
                  <span className="text-blue-700">Citas:</span>
                  <span className="font-bold ml-2">{appointments.length}</span>
                </div>
                <div>
                  <span className="text-blue-700">Búsqueda:</span>
                  <span className="font-bold ml-2">{filteredClients.length}</span>
                </div>
              </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {filteredClients.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {clients.length === 0 ? 'No hay clientes registrados' : 'No se encontraron clientes'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {clients.length === 0 
                      ? 'Comienza agregando tu primer cliente al sistema'
                      : 'Intenta con otros términos de búsqueda'
                    }
                  </p>
                  {clients.length === 0 && (
                    <button
                      onClick={() => {
                        setModalType('client');
                        setSelectedClient(null);
                        setShowModal(true);
                      }}
                      className="bg-[#37b7ff] text-white px-6 py-3 rounded-xl hover:bg-[#2da7ef] transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <UserPlus size={20} />
                      <span>Agregar Primer Cliente</span>
                    </button>
                  )}
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Puntos
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membresías
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client) => {
                      const clientMemberships = memberships.filter(m => m.client_id === client.id);
                      return (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-[#37b7ff]/10 rounded-full flex items-center justify-center">
                                <span className="text-[#37b7ff] font-semibold">
                                  {client.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-500">
                                  Cliente desde {new Date(client.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.email}</div>
                            <div className="text-sm text-gray-500">{client.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              <Award size={16} className="mr-1" />
                              {client.points || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {clientMemberships.length} activa{clientMemberships.length !== 1 ? 's' : ''}
                            </div>
                            {clientMemberships.length > 0 && (
                              <div className="text-sm text-gray-500">
                                ${clientMemberships.reduce((sum, m) => sum + m.monthly_payment, 0)}/mes
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedClient(client);
                                  setModalType('membership');
                                  setShowModal(true);
                                }}
                                className="text-[#37b7ff] hover:text-[#2da7ef] p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Crear membresía"
                              >
                                <CreditCard size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedClient(client);
                                  setModalType('points');
                                  setShowModal(true);
                                }}
                                className="text-yellow-600 hover:text-yellow-700 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Gestionar puntos"
                              >
                                <Gift size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedClient(client);
                                  setModalType('client');
                                  setShowModal(true);
                                }}
                                className="text-gray-600 hover:text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Editar cliente"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
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

        {activeTab === 'memberships' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Membresías Activas</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progreso
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pago Mensual
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {memberships.map((membership) => (
                      <tr key={membership.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{membership.clients?.name}</div>
                          <div className="text-sm text-gray-500">{membership.areas?.join(', ')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {membershipData[membership.category as keyof typeof membershipData]?.name}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">{membership.plan}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {membership.completed_sessions}/{membership.total_sessions} sesiones
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-[#37b7ff] h-2 rounded-full"
                              style={{
                                width: `${(membership.completed_sessions / membership.total_sessions) * 100}%`
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${membership.monthly_payment}</div>
                          <div className="text-sm text-gray-500">
                            Próximo: {new Date(membership.next_payment_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            membership.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : membership.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {membership.status === 'active' && <CheckCircle size={12} className="mr-1" />}
                            {membership.status === 'paused' && <Pause size={12} className="mr-1" />}
                            {membership.status === 'completed' && <Award size={12} className="mr-1" />}
                            {membership.status === 'active' ? 'Activa' : 
                             membership.status === 'paused' ? 'Pausada' :
                             membership.status === 'completed' ? 'Completada' : 'Cancelada'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-[#37b7ff] hover:text-[#2da7ef] mr-3">
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder para otras tabs */}
        {(activeTab === 'appointments' || activeTab === 'rewards') && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-gray-400 mb-4">
              {activeTab === 'appointments' ? <Calendar size={48} className="mx-auto" /> : <Gift size={48} className="mx-auto" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'appointments' ? 'Sistema de Citas' : 'Sistema de Recompensas'}
            </h3>
            <p className="text-gray-600">
              Esta sección está en desarrollo. Próximamente tendrás acceso completo a todas las funcionalidades.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={
          modalType === 'client' 
            ? (selectedClient ? 'Editar Cliente' : 'Nuevo Cliente')
            : modalType === 'membership'
            ? 'Nueva Membresía'
            : 'Gestionar Puntos'
        }
      >
        {modalType === 'client' && (
          <ClientForm
            client={selectedClient}
            onSave={handleModalClose}
            onCancel={handleModalClose}
          />
        )}
        {modalType === 'membership' && selectedClient && (
          <MembershipForm
            client={selectedClient}
            onSave={handleModalClose}
            onCancel={handleModalClose}
          />
        )}
        {modalType === 'points' && selectedClient && (
          <PointsManager
            client={selectedClient}
            onSave={handleModalClose}
            onCancel={handleModalClose}
          />
        )}
      </Modal>
    </div>
  );
};

// Componente de Login
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#37b7ff]/10 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-black">Derma</span>
              <span className="text-3xl font-bold text-[#37b7ff]">silk</span>
              <span className="text-sm font-normal text-gray-500 ml-1">®</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Panel de Administración</h2>
            <p className="text-gray-600">Inicia sesión para acceder al sistema</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                placeholder="admin@dermasilk.mx"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#37b7ff] text-white py-3 px-6 rounded-xl hover:bg-[#2da7ef] transition-colors disabled:opacity-50 font-semibold"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Sistema de gestión de membresías y clientes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37b7ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return session ? <Dashboard /> : <LoginScreen onLogin={() => {}} />;
}