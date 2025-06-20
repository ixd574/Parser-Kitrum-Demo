import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { normalizeTables } from '@/lib/utils.js';
import { 
  FileText, 
  Table as TableIcon, 
  Code, 
  Download, 
  Copy,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const MarkdownRenderer = ({ content, tables }) => {
  if (!content) return null;

  // Enhanced markdown processing that handles OpenAI-formatted content
  const processContent = () => {
    if (!content) return '';
    
    // Clean the content first
    let processedContent = content.trim();
    
    // Convert markdown headers to HTML (including #### headers)
    processedContent = processedContent.replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold mt-4 mb-2 text-gray-800">$1</h4>');
    processedContent = processedContent.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-800">$1</h3>');
    processedContent = processedContent.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-4 text-gray-900">$1</h2>');
    processedContent = processedContent.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-10 mb-6 text-gray-900">$1</h1>');
    
    // Convert horizontal rules
    processedContent = processedContent.replace(/\\---/g, '<hr class="my-6 border-gray-300">');
    processedContent = processedContent.replace(/^---$/gm, '<hr class="my-6 border-gray-300">');
    
    // Convert markdown text formatting (handle both ** and existing HTML)
    processedContent = processedContent.replace(/\*\*([^*\n]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    processedContent = processedContent.replace(/\*([^*\n]+)\*/g, '<em class="italic text-gray-700">$1</em>');
    
    // Clean up any escaped HTML that might have come from OpenAI
    processedContent = processedContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
    // Convert markdown tables to HTML tables
    const tableRegex = /\|(.+)\|\s*\n\|[-\s|:]+\|\s*\n((?:\|.+\|\s*\n?)*)/g;
    processedContent = processedContent.replace(tableRegex, (match, headerRow, bodyRows) => {
      // Parse header
      const headers = headerRow.split('|').map(h => h.trim()).filter(h => h);
      
      // Parse body rows
      const rows = bodyRows.trim().split('\n').map(row => 
        row.split('|').map(cell => cell.trim()).filter(cell => cell)
      ).filter(row => row.length > 0);
      
      // Generate HTML table with proper formatting for cell content
      const tableHtml = `
        <div class="my-8 overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
            <thead class="bg-gray-50">
              <tr>
                ${headers.map(header => {
                  // Format header content
                  let formattedHeader = header.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
                  return `<th class="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 text-left">${formattedHeader}</th>`;
                }).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr class="hover:bg-gray-50">
                  ${row.map(cell => {
                    // Format cell content
                    let formattedCell = String(cell || '—');
                    formattedCell = formattedCell.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
                    formattedCell = formattedCell.replace(/\(([^)]+)\)/g, '($1)'); // Handle parentheses for negative numbers
                    return `<td class="border border-gray-300 px-3 py-2 text-sm text-gray-700">${formattedCell}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      
      return tableHtml;
    });
    
    // Convert paragraphs
    const paragraphs = processedContent.split(/\n\s*\n/);
    const processedParagraphs = paragraphs.map(paragraph => {
      const trimmed = paragraph.trim();
      if (!trimmed) return '';
      
      // Skip if it's already HTML (headers, tables, etc.)
      if (trimmed.startsWith('<')) {
        return trimmed;
      }
      
      // Convert to paragraph
      const cleanParagraph = trimmed.replace(/\n/g, ' ');
      return `<p class="mb-4 text-gray-700 leading-relaxed">${cleanParagraph}</p>`;
    }).filter(p => p);
    
    return processedParagraphs.join('\n');
  };

  return (
    <div className="prose prose-sm max-w-none">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div 
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: processContent()
          }} 
        />
        
        {/* Debug info */}
        {tables && tables.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Document processed successfully with AI formatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TableViewer = ({ tables }) => {
  const [expandedTables, setExpandedTables] = useState(new Set([0]));

  if (!tables || tables.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <TableIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No tables found in the document</p>
      </div>
    );
  }

  const toggleTable = (index) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTables(newExpanded);
  };

  return (
    <div className="space-y-4">
      {tables.map((table, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center space-x-2">
                <TableIcon className="h-4 w-4" />
                <span>Table {index + 1}</span>
                <Badge variant="secondary">
                  {table.length} × {table[0]?.length || 0}
                </Badge>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleTable(index)}
              >
                {expandedTables.has(index) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          
          {expandedTables.has(index) && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <tbody>
                    {table.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex === 0 ? 'bg-muted/50' : ''}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border border-border px-3 py-2 text-sm"
                          >
                            {cell || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

const JSONViewer = ({ data, title = "Structured Data" }) => {
  const [copied, setCopied] = useState(false);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No structured data available</p>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>{title}</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </CardContent>
    </Card>
  );
};

const ChunksViewer = ({ chunks }) => {
  if (!chunks || Object.keys(chunks).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No content chunks available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(chunks).map(([key, chunk], index) => (
        <Card key={key}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Chunk {index + 1}</span>
              <Badge variant="outline">{key}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
              {typeof chunk === 'string' ? chunk : JSON.stringify(chunk, null, 2)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ResultsDisplay = ({ results }) => {
  if (!results) return null;

  const tables = normalizeTables(results.tables);

  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'runpulse-results.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Processing Results</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadResults}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="chunks">Chunks</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="mt-6">
            <MarkdownRenderer content={results.markdown} tables={tables} />
          </TabsContent>
          
          <TabsContent value="tables" className="mt-6">
            <TableViewer tables={tables} />
          </TabsContent>
          
          <TabsContent value="chunks" className="mt-6">
            <ChunksViewer chunks={results.chunks} />
          </TabsContent>
          
          <TabsContent value="data" className="mt-6">
            <div className="space-y-4">
              {results['schema-json'] && Object.keys(results['schema-json']).length > 0 && (
                <JSONViewer data={results['schema-json']} title="Schema JSON" />
              )}
              <JSONViewer data={results['plan-info']} title="Processing Info" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;

