import { useState } from 'react';
import type { User as AppUser, UserRole } from '../types';
import { Users, Edit, Trash2, UserPlus, Shield, GraduationCap, User } from 'lucide-react';

interface AdminViewProps {
    users: AppUser[];
    setUsers: (users: AppUser[]) => void;
    currentUser: AppUser;
}

export function AdminView({ users, setUsers, currentUser }: AdminViewProps) {
    const [viewMode, setViewMode] = useState<'users' | 'create'>('users');
    const [editingUser, setEditingUser] = useState<AppUser | null>(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'student' as UserRole,
        password: ''
    });

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return <Shield size={16} className="text-red-500" />;
            case 'staff':
                return <User size={16} className="text-blue-500" />;
            case 'student':
                return <GraduationCap size={16} className="text-green-500" />;
        }
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'staff':
                return 'bg-blue-100 text-blue-800';
            case 'student':
                return 'bg-green-100 text-green-800';
        }
    };

    const handleCreateUser = () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            alert('Please fill in all fields');
            return;
        }

        const user: AppUser = {
            id: `u${Date.now()}`,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };

        setUsers([...users, user]);
        setNewUser({ name: '', email: '', role: 'student', password: '' });
        setViewMode('users');
        alert('User created successfully!');
    };

    const handleUpdateUser = (userId: string, updates: Partial<AppUser>) => {
        setUsers(users.map(user =>
            user.id === userId
                ? { ...user, ...updates, updatedAt: new Date() }
                : user
        ));
        setEditingUser(null);
        alert('User updated successfully!');
    };

    const handleDeleteUser = (userId: string) => {
        if (userId === currentUser.id) {
            alert('You cannot delete your own account!');
            return;
        }

        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setUsers(users.filter(user => user.id !== userId));
            alert('User deleted successfully!');
        }
    };

    const startEditing = (user: AppUser) => {
        setEditingUser(user);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield size={24} className="text-red-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setViewMode('users')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                            viewMode === 'users'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Users size={20} />
                        Manage Users ({users.length})
                    </button>
                    <button
                        onClick={() => setViewMode('create')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                            viewMode === 'create'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <UserPlus size={20} />
                        Create User
                    </button>
                </div>
            </div>

            {/* Users Management */}
            {viewMode === 'users' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">All Users</h2>

                    {users.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Users size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">No users found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {users.map(user => (
                                <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    {editingUser?.id === user.id ? (
                                        // Edit Mode
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                    <input
                                                        type="text"
                                                        value={editingUser.name}
                                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={editingUser.email}
                                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                    <select
                                                        value={editingUser.role}
                                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="staff">Staff</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateUser(user.id, editingUser)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={() => setEditingUser(null)}
                                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {getRoleIcon(user.role)}
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                                                    <p className="text-sm text-gray-600">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                                <button
                                                    onClick={() => startEditing(user)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Edit user"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete user"
                                                    disabled={user.id === currentUser.id}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Create User Form */}
            {viewMode === 'create' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New User</h2>

                    <div className="max-w-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter email address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="student">Student</option>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleCreateUser}
                                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                <UserPlus size={16} />
                                Create User
                            </button>
                            <button
                                onClick={() => setViewMode('users')}
                                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}