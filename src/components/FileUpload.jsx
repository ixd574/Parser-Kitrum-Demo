import React from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { fileUtils } from '../lib/api.js';

const FileUpload = ({ 
  files, 
  dragActive, 
  onDrag, 
  onDrop, 
  onFileSelect, 
  onRemoveFile, 
  onClearFiles,
  disabled = false 
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
          `}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          onClick={() => !disabled && document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={onFileSelect}
            disabled={disabled}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.tiff"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: PDF, Word, Excel, Text, CSV, Images (JPEG, PNG, TIFF)
              </p>
            </div>
            
            {!disabled && (
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFiles}
                disabled={disabled}
              >
                Clear All
              </Button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-lg">
                      {fileUtils.getFileTypeIcon(file.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {fileUtils.formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(index)}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;

