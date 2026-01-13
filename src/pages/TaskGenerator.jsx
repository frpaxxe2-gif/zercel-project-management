import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import PRDUploadDialog from '../components/PRDUploadDialog';
import TaskService from '../services/taskService';
import { supabase } from '../config/supabase';

export default function TaskGenerator() {
  const { user, githubService } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [creatingTasks, setCreatingTasks] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const taskService = new TaskService();

  // Load user's projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setLoadingProjects(false);
      }
    };

    if (user?.id) {
      loadProjects();
    }
  }, [user?.id]);

  const handleTasksGenerated = (data) => {
    setGeneratedData(data);
    setSelectedTasks(data.tasks.map((t) => t.id));
    toast.success(`Ready to create ${data.tasks.length} tasks`);
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleCreateTasks = async () => {
    if (selectedTasks.length === 0) {
      toast.error('Please select at least one task');
      return;
    }

    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    setCreatingTasks(true);
    try {
      const tasksToCreate = generatedData.tasks.filter((t) => selectedTasks.includes(t.id));
      const result = await taskService.createTasks(tasksToCreate, user.id, selectedProjectId);

      if (result.success) {
        toast.success(`✅ Created ${result.count} tasks!`);
        setGeneratedData(null);
        setSelectedTasks([]);
        setSelectedProjectId('');
        // After saving tasks to the DB, create GitHub branches and spawn Codespaces per task when possible
        try {
          // Attempt to fetch repository info from the selected project
          const { data: projectInfo, error: projErr } = await supabase
            .from('projects')
            .select('repo_owner, repo_name')
            .eq('id', selectedProjectId)
            .single();

          if (projErr || !projectInfo || !projectInfo.repo_owner || !projectInfo.repo_name) {
            if (!projErr) console.info('Project has no repo_owner/repo_name configured, skipping GitHub ops');
          } else if (!githubService) {
            toast('Saved tasks, but GitHub not connected. Connect GitHub to auto-create branches.');
          } else {
            const owner = projectInfo.repo_owner;
            const repo = projectInfo.repo_name;
            // Iterate created tasks (result.tasks expected)
            const createdTasks = result.tasks || [];
            for (const t of createdTasks) {
              try {
                const slug = (t.title || 'task').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50);
                const branchName = `task/${t.id}-${slug}`;

                await githubService.createBranch(owner, repo, branchName, 'main');
                // Spawn a Codespace for the branch; ignore response details
                await githubService.createCodespace(owner, repo, branchName).catch((e) => {
                  console.warn('Codespace creation failed for', branchName, e);
                });
              } catch (e) {
                console.warn('GitHub operation failed for task', t.id, e);
              }
            }
            toast.success('GitHub branches (and Codespaces where possible) created for tasks');
          }
        } catch (e) {
          console.error('Post-create GitHub operations failed', e);
        }
      } else {
        toast.error('Failed to save tasks: ' + result.error);
      }
    } catch (error) {
      toast.error('Error creating tasks: ' + error.message);
    } finally {
      setCreatingTasks(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Task Generator</h1>
          <p className="text-gray-400">
            Upload a PRD or TDD and let AI break it down into actionable tasks
          </p>
        </div>

        {/* Setup Notice */}
        <div className="mb-8 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            <strong>⚙️ Setup Required:</strong> Add AI API key to .env.local before using. See{' '}
            <a href="https://github.com/frpaxxe2-gif/zercel-project-management#setup" 
               className="underline hover:text-blue-200" target="_blank" rel="noreferrer">
              setup docs
            </a>
            . Need a test document?{' '}
            <a href="/example-prd.txt" className="underline hover:text-blue-200" download>
              Download example PRD
            </a>
          </p>
        </div>

        {!generatedData ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-white mb-2">Start Generating Tasks</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Upload a Product Requirements Document (PRD) or Technical Design Document (TDD) and
              our AI will automatically break it into tasks, epics, and dependencies.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-white">{generatedData.tasks.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Epics</p>
                <p className="text-3xl font-bold text-white">{generatedData.epics.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Selected</p>
                <p className="text-3xl font-bold text-indigo-400">{selectedTasks.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Est. Duration</p>
                <p className="text-xl font-bold text-white">{generatedData.summary?.estimatedDuration}</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Select Project</h3>
              {loadingProjects ? (
                <p className="text-gray-400">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="text-gray-400">
                  No projects found. Create a project first to assign tasks.
                </p>
              ) : (
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 outline-none"
                >
                  <option value="">-- Select a project --</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Epics</h3>
              <div className="space-y-3">
                {generatedData.epics.map((epic) => (
                  <div key={epic.name} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{epic.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{epic.description}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          epic.priority === 'critical'
                            ? 'bg-red-900/30 text-red-300'
                            : epic.priority === 'high'
                            ? 'bg-orange-900/30 text-orange-300'
                            : 'bg-blue-900/30 text-blue-300'
                        }`}
                      >
                        {epic.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Tasks</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {generatedData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      className="mt-1 w-4 h-4 rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h4 className="font-semibold text-white">{task.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 rounded text-xs">
                            {task.type}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              task.complexity === 'complex'
                                ? 'bg-red-900/30 text-red-300'
                                : task.complexity === 'hard'
                                ? 'bg-orange-900/30 text-orange-300'
                                : task.complexity === 'medium'
                                ? 'bg-yellow-900/30 text-yellow-300'
                                : 'bg-green-900/30 text-green-300'
                            }`}
                          >
                            {task.complexity}
                          </span>
                          <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                            {task.estimatedHours}h
                          </span>
                        </div>
                      </div>
                      {task.dependencies.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          ⚡ Depends on: {task.dependencies.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {generatedData.summary?.keyRisks && generatedData.summary.keyRisks.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-300 mb-3">⚠️ Key Risks</h3>
                <ul className="space-y-2">
                  {generatedData.summary.keyRisks.map((risk, idx) => (
                    <li key={idx} className="text-yellow-200 text-sm">
                      • {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setGeneratedData(null);
                  setSelectedTasks([]);
                  setSelectedProjectId('');
                }}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTasks}
                disabled={
                  selectedTasks.length === 0 || !selectedProjectId || creatingTasks || loadingProjects
                }
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
              >
                {creatingTasks ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Tasks...
                  </>
                ) : (
                  <>✅ Create {selectedTasks.length} Tasks</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <PRDUploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onTasksGenerated={handleTasksGenerated}
      />
    </div>
  );
}
