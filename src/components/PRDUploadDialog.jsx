import { useState } from 'react';
import toast from 'react-hot-toast';
import AIDocumentParser from '../services/aiDocumentParser';

export default function PRDUploadDialog({ onTasksGenerated, isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState('PRD');
  const [preview, setPreview] = useState('');

  const parser = new AIDocumentParser();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Read file preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      // Show first 500 chars as preview
      setPreview(content.substring(0, 500) + '...');
    };
    reader.readAsText(selectedFile);
  };

  const handleParse = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    try {
      // Read file content
      const content = await file.text();

      if (!parser.isValidDocument(content)) {
        toast.error('Document is too short or invalid');
        return;
      }

      toast.loading('Analyzing document with AI...');

      // Parse document with Claude
      const result = await parser.parseDocument(content, documentType);

      if (result.success) {
        // Generate tasks from parsed data
        const tasks = await parser.generateTasks(result.data.epics, result.data.tasks);

        toast.dismiss();
        toast.success(`Generated ${tasks.length} tasks from ${documentType}`);

        // Callback with generated tasks and metadata
        onTasksGenerated({
          tasks,
          epics: result.data.epics,
          summary: result.data.summary,
          sourceFile: file.name,
          documentType,
        });

        // Close dialog
        onClose();
        setFile(null);
        setPreview('');
      }
    } catch (error) {
      toast.dismiss();
      const errorMsg = error.message || 'Failed to parse document';
      
      // Provide helpful error messages
      if (errorMsg.includes('API key') || errorMsg.includes('No AI API')) {
        toast.error('❌ No AI API key configured\n\nAdd to .env.local:\nVITE_OPENROUTER_API_KEY=sk-or-...');
      } else if (errorMsg.includes('401') || errorMsg.includes('403')) {
        toast.error('❌ Invalid API key. Check your credentials.');
      } else {
        toast.error(`Failed: ${errorMsg}`);
      }
      console.error('Parse error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">
          Upload {documentType} & Generate Tasks
        </h2>

        {/* Document Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Document Type
          </label>
          <div className="flex gap-4">
            {['PRD', 'TDD'].map((type) => (
              <button
                key={type}
                onClick={() => setDocumentType(type)}
                className={`px-4 py-2 rounded-lg transition ${
                  documentType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type === 'PRD' ? 'Product Requirements' : 'Technical Design'}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload File (TXT, MD, or PDF)
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer">
            <input
              type="file"
              accept=".txt,.md,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
              disabled={loading}
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="text-gray-400 mb-2">
                {file ? (
                  <>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </>
                ) : (
                  <>
                    <p className="mb-2">📄 Drag and drop your file here</p>
                    <p className="text-sm">or click to browse</p>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preview
            </label>
            <div className="bg-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{preview}</p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mb-6 bg-indigo-900/30 border border-indigo-700 rounded-lg p-4">
          <p className="text-sm text-indigo-300">
            💡 <strong>Tip:</strong> The AI will analyze your document and generate a complete
            task breakdown with epics, dependencies, and estimated complexity.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleParse}
            disabled={!file || loading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>✨ Generate Tasks</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
