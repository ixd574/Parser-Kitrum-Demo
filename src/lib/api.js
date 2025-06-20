// API service for RunPulse integration
const API_BASE_URL = 'https://api.runpulse.com';

export class RunPulseAPI {
  constructor(apiKey) {
    this.apiKey = apiKey || import.meta.env.VITE_RUNPULSE_API_KEY;
  }

  // Convert file to presigned URL for processing
  async convertFile(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add processing options
    if (options.returnTables) {
      formData.append('return_table', 'true');
    }
    if (options.chunking) {
      formData.append('chunking', options.chunking);
    }
    if (options.schema) {
      formData.append('schema', JSON.stringify(options.schema));
    }
    if (options.pages) {
      formData.append('pages', options.pages);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/convert`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug log
      return result;
    } catch (error) {
      console.error('Error converting file:', error);
      throw error;
    }
  }

  // Extract content from file using presigned URL
  async extractFile(fileUrl, options = {}) {
    const requestBody = {
      'file-url': fileUrl,
      return_table: options.returnTables || false,
      experimental_return_table: options.experimentalReturnTable || false,
      chunking: options.chunking || 'semantic',
      schema: options.schema || {},
      schema_prompt: options.schemaPrompt || '',
      pages: options.pages || '',
    };

    try {
      const response = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle large document responses (URL-based)
      if (result.is_url) {
        const documentResponse = await fetch(result.url);
        if (!documentResponse.ok) {
          throw new Error('Failed to fetch document from URL');
        }
        return await documentResponse.json();
      }

      return result;
    } catch (error) {
      console.error('Error extracting file:', error);
      throw error;
    }
  }

  // Process file with automatic endpoint selection based on size
  async processFile(file, options = {}) {
    const fileSizeMB = file.size / (1024 * 1024);
    
    try {
      // Step 1: Upload file using convert endpoint to get presigned URL
      const uploadResult = await this.convertFile(file, options);
      console.log('Upload result:', uploadResult);
      
      // Step 2: Extract content using the s3_object_url
      if (uploadResult.s3_object_url) {
        console.log('Extracting content from:', uploadResult.s3_object_url);
        const extractResult = await this.extractFile(uploadResult.s3_object_url, options);
        console.log('Extract result:', extractResult);
        
        // Step 3: Format the complete document using OpenAI
        if (extractResult.markdown || extractResult.tables) {
          console.log('Formatting complete document with OpenAI...');
          try {
            const formatResponse = await fetch(import.meta.env.VITE_OPENAI_FORMATTER_URL || 'https://5000-ilggczbxcfy3q33sieuyp-79631b79.manusvm.computer/format-document', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                markdown: extractResult.markdown || '',
                tables: extractResult.tables || [],
                chunks: extractResult.chunks || []
              })
            });

            if (formatResponse.ok) {
              const formatData = await formatResponse.json();
              console.log('Format response:', formatData);
              
              // Return the formatted data
              return {
                ...extractResult,
                markdown: formatData.formatted_markdown,
                original_markdown: extractResult.markdown,
                formatting_stats: {
                  tables_processed: formatData.tables_processed,
                  chunks_processed: formatData.chunks_processed
                }
              };
            } else {
              console.warn('OpenAI formatting failed, using original data');
              return extractResult;
            }
          } catch (formatError) {
            console.warn('OpenAI formatting error:', formatError);
            return extractResult;
          }
        }
        
        return extractResult;
      } else {
        throw new Error('No S3 object URL returned from upload');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
}

// Utility functions for file processing
export const fileUtils = {
  // Validate file type
  isValidFileType(file) {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
      'image/jpeg',
      'image/png',
      'image/tiff',
    ];
    
    return validTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|xls|xlsx|txt|csv|jpg|jpeg|png|tiff)$/i);
  },

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file extension
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  // Get file type icon
  getFileTypeIcon(filename) {
    const ext = this.getFileExtension(filename).toLowerCase();
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      txt: '📄',
      csv: '📊',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      tiff: '🖼️',
    };
    return iconMap[ext] || '📄';
  }
};

export default RunPulseAPI;

