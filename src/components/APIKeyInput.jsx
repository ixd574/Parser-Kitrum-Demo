import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react';

const APIKeyInput = ({ apiKey, onApiKeyChange, disabled = false }) => {
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey || '');

  const handleSave = () => {
    onApiKeyChange(tempKey);
  };

  const handleClear = () => {
    setTempKey('');
    onApiKeyChange('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base flex items-center space-x-2">
          <Key className="h-4 w-4" />
          <span>API Configuration</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">RunPulse API Key</Label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                placeholder="Enter your RunPulse API key"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                disabled={disabled}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
                disabled={disabled}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              onClick={handleSave}
              disabled={disabled || !tempKey.trim() || tempKey === apiKey}
              size="sm"
            >
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={disabled || !tempKey}
              size="sm"
            >
              Clear
            </Button>
          </div>
        </div>

        {!apiKey && (
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              You need a RunPulse API key to process documents. 
              <Button
                variant="link"
                className="p-0 h-auto ml-1"
                onClick={() => window.open('https://docs.runpulse.com/', '_blank')}
              >
                Get your API key
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {apiKey && (
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              API key configured successfully. You can now process documents.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Your API key is stored locally in your browser</p>
          <p>• It's never sent to any server except RunPulse API</p>
          <p>• Clear your browser data to remove the stored key</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyInput;

