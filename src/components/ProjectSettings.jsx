import { format } from "date-fns";
import { Plus, Save, Trash2, Archive, Bell, Check, X, AlertTriangle, Github } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddProjectMember from "./AddProjectMember";
import { useAuth } from "../context/useAuth";

export default function ProjectSettings({ project }) {
    const navigate = useNavigate();
    const { githubService } = useAuth();
    const [isCreatingRepo, setIsCreatingRepo] = useState(false);
    // Create GitHub Repo handler
    const handleCreateRepo = async () => {
        if (!githubService) {
            toast.error("GitHub not connected");
            return;
        }
        setIsCreatingRepo(true);
        toast.loading("Creating GitHub repository...");
        try {
            const repo = await githubService.createRepository(formData.name, formData.description, formData.visibility === "PRIVATE");
            toast.dismiss();
            toast.success("Repository created: " + repo.full_name);
            // Optionally, store repo info in project state/db here
        } catch (err) {
            toast.dismiss();
            toast.error(err?.message || "Failed to create repo");
        } finally {
            setIsCreatingRepo(false);
        }
    };

    const [formData, setFormData] = useState({
        name: "New Website Launch",
        description: "Initial launch for new web platform.",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "2025-09-10",
        end_date: "2025-10-15",
        progress: 30,
        budget: 50000,
        visibility: "PRIVATE",
        archived: false,
    });

    const [activeSettingsTab, setActiveSettingsTab] = useState("general");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        taskAssigned: true,
        taskCompleted: true,
        taskCommented: true,
        projectUpdated: true,
        memberAdded: true,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            toast.loading("Saving project settings...");
            
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            toast.dismissAll();
            toast.success("Project settings saved successfully");
        } catch {
            toast.dismissAll();
            toast.error("Failed to save settings");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProject = async () => {
        try {
            setIsSubmitting(true);
            toast.loading("Deleting project...");
            
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            toast.dismissAll();
            toast.success("Project deleted successfully");
            navigate("/projects");
        } catch {
            toast.dismissAll();
            toast.error("Failed to delete project");
        } finally {
            setIsSubmitting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleArchiveProject = async () => {
        try {
            setIsSubmitting(true);
            toast.loading("Archiving project...");
            
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            setFormData({ ...formData, archived: true });
            
            toast.dismissAll();
            toast.success("Project archived successfully");
            setShowArchiveConfirm(false);
        } catch {
            toast.dismissAll();
            toast.error("Failed to archive project");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (project) setFormData(project);
    }, [project]);

    const inputClasses = "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";

    const cardClasses = "rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";

    const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400";

    const settingsTabs = [
        { id: "general", label: "General" },
        { id: "team", label: "Team Members" },
        { id: "notifications", label: "Notifications" },
        { id: "danger", label: "Danger Zone" },
    ];

    return (
        <div className="space-y-6">
            {/* GitHub Repo Creation */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    type="button"
                    onClick={handleCreateRepo}
                    disabled={isCreatingRepo || !githubService}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <Github className="w-5 h-5" />
                    {isCreatingRepo ? "Creating..." : "Create GitHub Repo"}
                </button>
                {!githubService && (
                    <span className="text-xs text-red-500">Connect GitHub in Integrations first</span>
                )}
            </div>
            {/* Settings Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-700 pb-4">
                {settingsTabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSettingsTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                            activeSettingsTab === tab.id
                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Settings */}
            {activeSettingsTab === "general" && (
                <div className={`${cardClasses} mt-6`}>
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-6">Project Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className={labelClasses}>Project Name</label>
                            <input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className={labelClasses}>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={inputClasses + " h-24"}
                            />
                        </div>

                        {/* Status & Priority */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className={labelClasses}>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className={inputClasses}
                                >
                                    <option value="PLANNING">Planning</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="ON_HOLD">On Hold</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className={labelClasses}>Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className={inputClasses}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className={labelClasses}>Start Date</label>
                                <input
                                    type="date"
                                    value={format(new Date(formData.start_date), "yyyy-MM-dd")}
                                    onChange={(e) => setFormData({ ...formData, start_date: new Date(e.target.value) })}
                                    className={inputClasses}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>End Date</label>
                                <input
                                    type="date"
                                    value={format(new Date(formData.end_date), "yyyy-MM-dd")}
                                    onChange={(e) => setFormData({ ...formData, end_date: new Date(e.target.value) })}
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                            <label className={labelClasses}>Progress: {formData.progress}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={formData.progress}
                                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                                className="w-full accent-blue-500 dark:accent-blue-400"
                            />
                        </div>

                        {/* Budget */}
                        <div className="space-y-2">
                            <label className={labelClasses}>Budget ($)</label>
                            <input
                                type="number"
                                value={formData.budget || ""}
                                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                                className={inputClasses}
                                placeholder="0"
                            />
                        </div>

                        {/* Visibility */}
                        <div className="space-y-2">
                            <label className={labelClasses}>Visibility</label>
                            <select
                                value={formData.visibility || "PRIVATE"}
                                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                                className={inputClasses}
                            >
                                <option value="PRIVATE">Private</option>
                                <option value="TEAM">Team Only</option>
                                <option value="PUBLIC">Public</option>
                            </select>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center text-sm justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50 transition"
                            >
                                <Save className="size-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Team Members */}
            {activeSettingsTab === "team" && (
                <div className={`${cardClasses} mt-6`}>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300">
                            Team Members <span className="text-sm text-zinc-600 dark:text-zinc-400">({project?.members?.length || 0})</span>
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(true)}
                            className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        >
                            <Plus className="size-4 text-zinc-900 dark:text-zinc-300" />
                        </button>
                        <AddProjectMember isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>

                    {/* Member List */}
                    {project?.members && project.members.length > 0 ? (
                        <div className="space-y-2">
                            {project.members.map((member, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between px-4 py-3 rounded-lg dark:bg-zinc-800 bg-zinc-50 text-sm text-zinc-900 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                            <span className="text-xs text-white font-semibold">
                                                {member?.user?.email?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{member?.user?.email || "Unknown"}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{member?.role || "Member"}</p>
                                        </div>
                                    </div>
                                    {project.team_lead === member.user.id && (
                                        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                                            Team Lead
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                            <p>No team members yet</p>
                            <p className="text-xs mt-1">Add members to start collaborating</p>
                        </div>
                    )}
                </div>
            )}

            {/* Notifications */}
            {activeSettingsTab === "notifications" && (
                <div className={`${cardClasses} mt-6`}>
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-6 flex items-center gap-2">
                        <Bell className="size-5" /> Notification Preferences
                    </h2>

                    <div className="space-y-4">
                        {[
                            { key: "taskAssigned", label: "Task Assigned", description: "Notify when a task is assigned to you" },
                            { key: "taskCompleted", label: "Task Completed", description: "Notify when a task is completed" },
                            { key: "taskCommented", label: "Task Commented", description: "Notify when someone comments on a task" },
                            { key: "projectUpdated", label: "Project Updated", description: "Notify when project details are updated" },
                            { key: "memberAdded", label: "Member Added", description: "Notify when a new member joins the project" },
                        ].map((notification) => (
                            <div
                                key={notification.key}
                                className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-300">{notification.label}</p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{notification.description}</p>
                                </div>
                                <button
                                    onClick={() =>
                                        setNotificationSettings({
                                            ...notificationSettings,
                                            [notification.key]: !notificationSettings[notification.key],
                                        })
                                    }
                                    className={`p-2 rounded-lg transition ${
                                        notificationSettings[notification.key]
                                            ? "bg-blue-100 dark:bg-blue-900/30"
                                            : "bg-zinc-200 dark:bg-zinc-700"
                                    }`}
                                >
                                    {notificationSettings[notification.key] ? (
                                        <Check className="size-4 text-blue-600 dark:text-blue-400" />
                                    ) : (
                                        <X className="size-4 text-zinc-600 dark:text-zinc-400" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Danger Zone */}
            {activeSettingsTab === "danger" && (
                <div className="space-y-4 mt-6">
                    {/* Archive Project */}
                    <div className="rounded-lg border border-amber-200 dark:border-amber-900/30 p-6 bg-amber-50 dark:bg-amber-900/10">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-amber-900 dark:text-amber-300">Archive Project</h3>
                                    <p className="text-sm text-amber-800 dark:text-amber-400 mt-1">
                                        Archived projects are hidden from the main view but can be restored later.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowArchiveConfirm(true)}
                                disabled={formData.archived}
                                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <Archive className="size-4" /> {formData.archived ? "Archived" : "Archive"}
                            </button>
                        </div>
                    </div>

                    {/* Delete Project */}
                    <div className="rounded-lg border border-red-200 dark:border-red-900/30 p-6 bg-red-50 dark:bg-red-900/10">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="size-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900 dark:text-red-300">Delete Project</h3>
                                    <p className="text-sm text-red-800 dark:text-red-400 mt-1">
                                        This action cannot be undone. All project data will be permanently deleted.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium flex items-center gap-2 transition"
                            >
                                <Trash2 className="size-4" /> Delete
                            </button>
                        </div>
                    </div>

                    {/* Archive Confirmation Dialog */}
                    {showArchiveConfirm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
                            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-sm mx-4">
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Archive Project?</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                                    Are you sure you want to archive this project? You can unarchive it later.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setShowArchiveConfirm(false)}
                                        className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleArchiveProject}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 transition"
                                    >
                                        {isSubmitting ? "Archiving..." : "Archive"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Dialog */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
                            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-sm mx-4">
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Delete Project?</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                                    This action cannot be undone. All tasks and project data will be permanently deleted.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteProject}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 transition"
                                    >
                                        {isSubmitting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
