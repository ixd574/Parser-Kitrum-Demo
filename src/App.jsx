import { useState, useEffect } from 'react';
import { FileText, Zap, Shield, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

// Components
import FileUpload from './components/FileUpload.jsx';
import ProcessingOptions from './components/ProcessingOptions.jsx';
import ProcessingStatus from './components/ProcessingStatus.jsx';
import ResultsDisplay from './components/ResultsDisplay.jsx';
import APIKeyInput from './components/APIKeyInput.jsx';

// Hooks
import { useFileProcessor, useFileUpload } from './hooks/useFileProcessor.js';

import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [processingOptions, setProcessingOptions] = useState({
    chunking: 'semantic',
    returnTables: true,
    experimentalReturnTable: false,
    pages: '',
    schema: {},
    schemaText: '',
    schemaPrompt: '',
  });

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('runpulse-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (newApiKey) => {
    setApiKey(newApiKey);
    if (newApiKey) {
      localStorage.setItem('runpulse-api-key', newApiKey);
    } else {
      localStorage.removeItem('runpulse-api-key');
    }
  };

  // File upload hook
  const {
    files,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removeFile,
    clearFiles,
  } = useFileUpload();

  // File processor hook
  const {
    processFile,
    isProcessing,
    results,
    error,
    progress,
    reset,
  } = useFileProcessor(apiKey);

  const handleProcessFiles = async () => {
    if (files.length === 0) return;
    
    // For demo purposes, process the first file
    // In a production app, you might want to process multiple files
    const file = files[0];
    await processFile(file, processingOptions);
  };

  const handleReset = () => {
    reset();
    clearFiles();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">File Parser</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Document Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Transform Documents into Structured Data
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload any document and extract clean, structured content using AI. 
              Perfect for data analysis, content processing, and automation workflows.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">AI-Powered Extraction</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced computer vision and NLP to understand complex document layouts
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Secure Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Your documents are processed securely with enterprise-grade encryption
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-3">
                <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto">
                  <Cpu className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Multiple Formats</h3>
                <p className="text-sm text-muted-foreground">
                  Support for PDFs, Word docs, Excel files, images, and more
                </p>
              </CardContent>
            </Card>
          </div>

          {/* API Key Configuration */}
          <APIKeyInput
            apiKey={apiKey}
            onApiKeyChange={handleApiKeyChange}
            disabled={isProcessing}
          />

          {/* File Upload */}
          <FileUpload
            files={files}
            dragActive={dragActive}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeFile}
            onClearFiles={clearFiles}
            disabled={isProcessing || !apiKey}
          />

          {/* Processing Options */}
          <ProcessingOptions
            options={processingOptions}
            onOptionsChange={setProcessingOptions}
            disabled={isProcessing || !apiKey}
          />

          {/* Action Buttons */}
          {files.length > 0 && apiKey && (
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleProcessFiles}
                disabled={isProcessing}
                size="lg"
                className="px-8"
              >
                {isProcessing ? 'Processing...' : 'Process Documents'}
              </Button>
              
              {(results || error) && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isProcessing}
                  size="lg"
                >
                  Reset
                </Button>
              )}
            </div>
          )}

          {/* Processing Status */}
          <ProcessingStatus
            isProcessing={isProcessing}
            progress={progress}
            error={error}
            results={results}
          />

          {/* Results Display */}
          {results && <ResultsDisplay results={results} />}

          {/* Demo Notice */}
          {!apiKey && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                This is a demo application. To process real documents, you'll need an API key.
                The interface shows all the features that would be available with a valid API key.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Powered by AI • Secure Document Processing</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
