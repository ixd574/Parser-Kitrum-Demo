import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Settings, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.jsx';

const ProcessingOptions = ({ options, onOptionsChange, disabled = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateOption = (key, value) => {
    onOptionsChange({ ...options, [key]: value });
  };

  const helpTexts = {
    chunking: "How the document is split into smaller pieces for processing. Semantic splits by meaning, Header splits by document sections, Page splits by individual pages, and Recursive breaks down content step by step.",
    returnTables: "When enabled, the AI will find and extract tables from your document as structured data that you can easily work with in spreadsheets or databases.",
    experimentalReturnTable: "Uses newer, experimental methods to find tables that might be missed by the standard approach. May find more tables but could be less reliable.",
    pages: "Choose specific pages to process instead of the entire document. For example: '1,3,5' processes pages 1, 3, and 5, or '1-5' processes pages 1 through 5.",
    schema: "Define what specific information you want to extract in a structured format. For example, you could ask for just names, dates, and amounts from invoices.",
    schemaPrompt: "Give the AI additional instructions about how to extract your data. For example: 'Focus on financial data' or 'Extract only contact information'."
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Processing Options</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={disabled}
          >
            {isExpanded ? 'Hide' : 'Show'} Options
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Chunking Strategy */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="chunking">Chunking Strategy</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{helpTexts.chunking}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={options.chunking || 'semantic'}
              onValueChange={(value) => updateOption('chunking', value)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chunking method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semantic">Semantic - Based on meaning</SelectItem>
                <SelectItem value="header">Header - Based on document headers</SelectItem>
                <SelectItem value="page">Page - By individual pages</SelectItem>
                <SelectItem value="recursive">Recursive - Iterative breakdown</SelectItem>
                <SelectItem value="semantic,header">Semantic + Header</SelectItem>
                <SelectItem value="semantic,page">Semantic + Page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table Extraction */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="return-tables">Extract Tables</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{helpTexts.returnTables}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                id="return-tables"
                checked={options.returnTables || false}
                onCheckedChange={(checked) => updateOption('returnTables', checked)}
                disabled={disabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="experimental-tables">Experimental Table Extraction</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{helpTexts.experimentalReturnTable}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                id="experimental-tables"
                checked={options.experimentalReturnTable || false}
                onCheckedChange={(checked) => updateOption('experimentalReturnTable', checked)}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Page Selection */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="pages">Page Selection</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{helpTexts.pages}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="pages"
              placeholder="e.g., 1,3,5 or 1-5,7-9 (leave empty for all pages)"
              value={options.pages || ''}
              onChange={(e) => updateOption('pages', e.target.value)}
              disabled={disabled}
            />
          </div>

          {/* Custom Schema */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="schema">Custom JSON Schema</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{helpTexts.schema}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id="schema"
              placeholder='{"type": "object", "properties": {"title": {"type": "string"}}}'
              value={options.schemaText || ''}
              onChange={(e) => {
                updateOption('schemaText', e.target.value);
                try {
                  const parsed = JSON.parse(e.target.value || '{}');
                  updateOption('schema', parsed);
                } catch {
                  // Invalid JSON, keep the text but don't update schema
                }
              }}
              disabled={disabled}
              rows={3}
            />
          </div>

          {/* Schema Prompt */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="schema-prompt">Schema Instructions</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{helpTexts.schemaPrompt}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id="schema-prompt"
              placeholder="Additional instructions for data extraction..."
              value={options.schemaPrompt || ''}
              onChange={(e) => updateOption('schemaPrompt', e.target.value)}
              disabled={disabled}
              rows={2}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ProcessingOptions;

