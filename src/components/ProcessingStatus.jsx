import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ProcessingStatus = ({ isProcessing, progress, error, results }) => {
  if (!isProcessing && !error && !results) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isProcessing && (
            <>
              <Clock className="h-5 w-5 text-blue-500 animate-spin" />
              <span>Processing Document...</span>
            </>
          )}
          {error && (
            <>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Processing Failed</span>
            </>
          )}
          {results && !isProcessing && (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Processing Complete</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Analyzing document structure and extracting content...
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {results && !isProcessing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {results['plan-info']?.pages_used || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Total Pages Processed</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {results.chunks ? Object.keys(results.chunks).length : 0}
                </div>
                <div className="text-xs text-muted-foreground">Content Chunks</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {results.tables ? results.tables.length : 0}
                </div>
                <div className="text-xs text-muted-foreground">Tables Found</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {results.markdown ? Math.round(results.markdown.length / 1000) : 0}K
                </div>
                <div className="text-xs text-muted-foreground">Characters</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Processing Details</h4>
              <div className="flex flex-wrap gap-2">
                {results['plan-info']?.tier && (
                  <Badge variant="secondary">
                    Tier: {results['plan-info'].tier}
                  </Badge>
                )}
                {results['plan-info']?.note && (
                  <Badge variant="outline">
                    {results['plan-info'].note}
                  </Badge>
                )}
                <Badge variant="outline">
                  Format: {results.markdown ? 'Markdown' : 'Unknown'}
                </Badge>
                {results.tables && results.tables.length > 0 && (
                  <Badge variant="outline">
                    Tables Extracted
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;

