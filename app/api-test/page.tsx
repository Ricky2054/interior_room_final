"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ApiTestPage() {
  const [prompt, setPrompt] = useState("");
  const [feature, setFeature] = useState("artistic");
  const [file, setFile] = useState<File | null>(null);
  const [transformFeature, setTransformFeature] = useState("color change");
  const [extraPrompt, setExtraPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<{
    valid?: boolean;
    message?: string;
    error?: string;
  } | null>(null);
  const [checkingApiKey, setCheckingApiKey] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    setCheckingApiKey(true);
    try {
      const response = await fetch("/api-test/check-api-key");
      const data = await response.json();
      setApiKeyStatus(data);
    } catch (err) {
      setApiKeyStatus({
        valid: false,
        error: err instanceof Error ? err.message : "Failed to check API key"
      });
    } finally {
      setCheckingApiKey(false);
    }
  };

  const handleGenerateTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("feature", feature);

      console.log("Sending generate request with:", {
        prompt,
        feature
      });

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResult(imageUrl);
    } catch (err) {
      console.error("Generate error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleTransformTest = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("feature", transformFeature);
      if (extraPrompt) {
        formData.append("extra_prompt", extraPrompt);
      }

      console.log("Sending transform request with:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        feature: transformFeature,
        extraPrompt: extraPrompt || "none"
      });

      const response = await fetch("/api/transform", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to transform image");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResult(imageUrl);
    } catch (err) {
      console.error("Transform error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

      {/* API Key Status */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Stability API Key Status</h2>
        
        {checkingApiKey ? (
          <p>Checking API key...</p>
        ) : apiKeyStatus ? (
          <div>
            {apiKeyStatus.valid ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                ✅ API key is valid
                {apiKeyStatus.message && <p>{apiKeyStatus.message}</p>}
              </div>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                ❌ API key is invalid
                {apiKeyStatus.error && <p>{apiKeyStatus.error}</p>}
              </div>
            )}
          </div>
        ) : (
          <p>API key status unknown</p>
        )}
        
        <Button 
          onClick={checkApiKey} 
          variant="outline" 
          className="mt-4"
          disabled={checkingApiKey}
        >
          {checkingApiKey ? "Checking..." : "Check API Key"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Generate API Test */}
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Generate API</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Prompt</label>
              <Textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt for image generation"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-2">Feature</label>
              <Select value={feature} onValueChange={setFeature}>
                <SelectTrigger>
                  <SelectValue placeholder="Select feature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="photorealistic">Photorealistic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleGenerateTest} 
              disabled={loading || !prompt || apiKeyStatus?.valid === false}
              className="w-full"
            >
              {loading ? "Loading..." : "Test Generate"}
            </Button>
          </div>
        </div>

        {/* Transform API Test */}
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Transform API</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Image</label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </div>
            
            <div>
              <label className="block mb-2">Feature</label>
              <Select value={transformFeature} onValueChange={setTransformFeature}>
                <SelectTrigger>
                  <SelectValue placeholder="Select feature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color change">Color Change</SelectItem>
                  <SelectItem value="refresh">Refresh</SelectItem>
                  <SelectItem value="maximize">Maximize</SelectItem>
                  <SelectItem value="redesign">Redesign</SelectItem>
                  <SelectItem value="functional change">Functional Change</SelectItem>
                  <SelectItem value="style stealer">Style Stealer</SelectItem>
                  <SelectItem value="image quality enhancer">Image Quality Enhancer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block mb-2">Extra Prompt (Optional)</label>
              <Textarea 
                value={extraPrompt} 
                onChange={(e) => setExtraPrompt(e.target.value)}
                placeholder="Additional details for the transformation"
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleTransformTest} 
              disabled={loading || !file || apiKeyStatus?.valid === false}
              className="w-full"
            >
              {loading ? "Loading..." : "Test Transform"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Result</h3>
          <div className="border rounded-lg overflow-hidden">
            <img src={result} alt="API Result" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
} 