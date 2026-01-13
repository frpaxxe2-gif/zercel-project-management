import { useState, useEffect } from "react";
import { Zap, Github, Database, Cloud, CheckCircle, XCircle, Settings, ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/useAuth";

export default function Integrations() {
    const navigate = useNavigate();
    const { loginWithGitHub, githubToken } = useAuth();

    const [connectedIntegrations, setConnectedIntegrations] = useState({
        github: false,
        supabase: false,
        mysql: false,
        sqlite: false,
        neon: false,
        mongodb: false,
        postgresql: false,
        stripe: false,
        slack: false,
        discord: false,
        googledrive: false,
        dropbox: false,
    });

    const [loadingIds, setLoadingIds] = useState({});

    // Reflect real auth/config state
    useEffect(() => {
        const supabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
        setConnectedIntegrations((prev) => ({
            ...prev,
            github: !!githubToken,
            supabase: supabaseConfigured || prev.supabase,
        }));
    }, [githubToken]);

    const integrations = [
        {
            id: "github",
            name: "GitHub",
            description: "Connect your GitHub repositories for version control and collaboration",
            category: "VCS",
            icon: "🐙",
            color: "from-gray-700 to-gray-900",
            docs: "https://github.com",
        },
        {
            id: "supabase",
            name: "Supabase",
            description: "Connect to Supabase PostgreSQL database with real-time capabilities",
            category: "Database",
            icon: "🟢",
            color: "from-green-500 to-green-700",
            docs: "https://supabase.com",
        },
        {
            id: "mysql",
            name: "MySQL",
            description: "Connect to MySQL databases for project data storage",
            category: "Database",
            icon: "🐬",
            color: "from-blue-500 to-blue-700",
            docs: "https://mysql.com",
        },
        {
            id: "sqlite",
            name: "SQLite",
            description: "Connect to SQLite databases for lightweight data storage",
            category: "Database",
            icon: "📦",
            color: "from-cyan-500 to-cyan-700",
            docs: "https://sqlite.org",
        },
        {
            id: "neon",
            name: "Neon",
            description: "Connect to Neon serverless PostgreSQL database",
            category: "Database",
            icon: "⚡",
            color: "from-purple-500 to-purple-700",
            docs: "https://neon.tech",
        },
        {
            id: "mongodb",
            name: "MongoDB",
            description: "Connect to MongoDB for NoSQL data storage",
            category: "Database",
            icon: "🍃",
            color: "from-green-600 to-green-800",
            docs: "https://mongodb.com",
        },
        {
            id: "postgresql",
            name: "PostgreSQL",
            description: "Connect to PostgreSQL relational database",
            category: "Database",
            icon: "🐘",
            color: "from-blue-600 to-blue-800",
            docs: "https://postgresql.org",
        },
        {
            id: "stripe",
            name: "Stripe",
            description: "Integrate Stripe for payment processing",
            category: "Payment",
            icon: "💳",
            color: "from-purple-600 to-purple-800",
            docs: "https://stripe.com",
        },
        {
            id: "slack",
            name: "Slack",
            description: "Send notifications and updates to Slack channels",
            category: "Communication",
            icon: "💬",
            color: "from-pink-500 to-pink-700",
            docs: "https://slack.com",
        },
        {
            id: "discord",
            name: "Discord",
            description: "Integrate Discord for team communication and notifications",
            category: "Communication",
            icon: "🎮",
            color: "from-indigo-600 to-indigo-800",
            docs: "https://discord.com",
        },
        {
            id: "googledrive",
            name: "Google Drive",
            description: "Connect Google Drive for file storage and sharing",
            category: "Storage",
            icon: "☁️",
            color: "from-red-500 to-red-700",
            docs: "https://drive.google.com",
        },
        {
            id: "dropbox",
            name: "Dropbox",
            description: "Integrate Dropbox for cloud file management",
            category: "Storage",
            icon: "📁",
            color: "from-blue-400 to-blue-600",
            docs: "https://dropbox.com",
        },
    ];

    const handleConnect = async (integrationId) => {
        try {
            setLoadingIds((s) => ({ ...s, [integrationId]: true }));

            if (integrationId === 'github') {
                // Use Supabase OAuth flow handled by AuthContext
                toast.loading('Redirecting to GitHub for authorization...');
                const result = await loginWithGitHub();
                toast.dismissAll();

                if (!result || !result.success) {
                    toast.error(result?.error || 'Failed to start GitHub OAuth');
                    return;
                }

                // When OAuth completes Supabase will redirect back and session will be available
                toast.success('Please authorize the app in GitHub. You will be redirected back when complete.');
                return;
            }

            if (integrationId === 'supabase') {
                const supabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
                if (supabaseConfigured) {
                    setConnectedIntegrations((s) => ({ ...s, supabase: true }));
                    toast.success('Supabase is configured for this app');
                } else {
                    toast('Supabase is not configured. See setup docs.', { icon: '⚠️' });
                }

                return;
            }

            // Fallback: open documentation for other integrations
            const integration = integrations.find(i => i.id === integrationId);
            window.open(integration.docs, '_blank');
            toast.success(`Opened docs for ${integration.name}`);
        } catch (err) {
            toast.error(err?.message || 'Failed to connect integration');
        } finally {
            setLoadingIds((s) => ({ ...s, [integrationId]: false }));
        }
    };

    const handleDisconnect = async (integrationId) => {
        try {
            setLoadingIds((s) => ({ ...s, [integrationId]: true }));

            if (integrationId === 'github') {
                // We cannot safely revoke provider access from client-side only in a generic way.
                // Inform the user what to do and update UI locally.
                setConnectedIntegrations((s) => ({ ...s, github: false }));
                toast.success('Disconnected locally. To fully revoke access, remove the app from your GitHub account or unlink the provider from your Supabase account.');
                return;
            }

            if (integrationId === 'supabase') {
                setConnectedIntegrations((s) => ({ ...s, supabase: false }));
                toast.success('Supabase connection cleared locally. To fully disable, update app config or environment variables.');
                return;
            }

            // Fallback: just mark disconnected locally
            setConnectedIntegrations((s) => ({ ...s, [integrationId]: false }));
            toast.success('Integration disconnected successfully');
        } catch (err) {
            toast.error(err?.message || 'Failed to disconnect integration');
        } finally {
            setLoadingIds((s) => ({ ...s, [integrationId]: false }));
        }
    };

    const categories = ["All", "Database", "VCS", "Payment", "Communication", "Storage"];
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredIntegrations = selectedCategory === "All"
        ? integrations
        : integrations.filter(i => i.category === selectedCategory);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/settings")}
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                    <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Integrations</h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Connect your favorite tools and services</p>
                </div>
            </div>

            {/* Info Banner */}
            <div className="rounded-lg border border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 p-4">
                <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-300">Seamless Integration</h3>
                        <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                            Connect external services and databases to enhance your project management workflow. All integrations are secure and authenticated.
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                    <div
                        key={integration.id}
                        className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 hover:shadow-lg dark:hover:shadow-2xl transition-shadow"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center text-2xl`}>
                                    {integration.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-white">{integration.name}</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{integration.category}</p>
                                </div>
                            </div>
                            {connectedIntegrations[integration.id] ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                                <XCircle className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                            {integration.description}
                        </p>

                        {/* Status */}
                        <div className="mb-4">
                            {connectedIntegrations[integration.id] ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    Connected
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                                    <XCircle className="w-3 h-3" />
                                    Not Connected
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            {connectedIntegrations[integration.id] ? (
                                <button
                                    onClick={() => handleDisconnect(integration.id)}
                                    disabled={!!loadingIds[integration.id]}
                                    className={`flex-1 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium text-sm ${loadingIds[integration.id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {loadingIds[integration.id] ? 'Disconnecting...' : 'Disconnect'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleConnect(integration.id)}
                                    disabled={!!loadingIds[integration.id]}
                                    className={`flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition font-medium text-sm ${loadingIds[integration.id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {loadingIds[integration.id] ? 'Connecting...' : 'Connect'}
                                </button>
                            )}
                            <a
                                href={integration.docs}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition flex items-center justify-center"
                                title="View Documentation"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredIntegrations.length === 0 && (
                <div className="text-center py-12">
                    <Database className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">No integrations found</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Try selecting a different category</p>
                </div>
            )}

            {/* Connected Integrations Summary */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Connected Integrations</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(connectedIntegrations).filter(([, isConnected]) => isConnected).length > 0 ? (
                        Object.entries(connectedIntegrations)
                            .filter(([, isConnected]) => isConnected)
                            .map(([integrationId]) => {
                                const integration = integrations.find(i => i.id === integrationId);
                                return (
                                    <div
                                        key={integrationId}
                                        className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-2"
                                    >
                                        <span>{integration.icon}</span>
                                        {integration.name}
                                    </div>
                                );
                            })
                    ) : (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">No integrations connected yet</p>
                    )}
                </div>
            </div>

            {/* Help Section */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">Need help?</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    For detailed setup instructions and API documentation, visit our{" "}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        integration guides
                    </a>
                    .
                    
                    Use **Connect** on GitHub to authorize via OAuth (handled by Supabase).
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Questions? Contact our support team at{" "}
                    <a href="mailto:support@example.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        support@example.com
                    </a>
                </p>
            </div>
        </div>
    );
}
