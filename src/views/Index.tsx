import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { signIn } from "@/store/slices/authSlice";

const Index = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate async sign in
    await new Promise(r => setTimeout(r, 500));
    dispatch(signIn({ name: name || "Demo User" }));
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-3">
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
};

export default Index;
