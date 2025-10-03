import Dashboard from "./Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Index = () => {
  const { isAuthenticated, signIn } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await signIn(name || "Demo User", password || "demo123");
              }}
              className="space-y-3"
            >
              <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setName('Demo User'); setPassword('demo123'); }}>Auto-fill</Button>
                <Button type="submit" className="flex-1">Continue</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Dashboard />
};

export default Index;
