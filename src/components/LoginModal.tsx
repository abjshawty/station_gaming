import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Button } from './ui/button';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { API_BASE_URL } from '../utils/api';
interface LoginModalProps {
  open: boolean;
}

export function LoginModal ({ open }: LoginModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();

  const handleSubmit = async () => {
    if (code.length !== 6) {
      toast.error('Please enter a complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/code/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.status === 200) {
        const result = (await response.json()) as {message: string, token: string}
       
        const authToken = result.token;

        // Store token in memory via context
        setToken(authToken);
        toast.success('Authentication successful!');
      } else if (response.status === 404) {
        // Clear input and show error
        setCode('');
        toast.error('Invalid code. Please try again.');
      } else {
        toast.error('Authentication failed. Please try again.');
        setCode('');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Connection error. Please check if the server is running.');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6 && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} modal>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {/* <ShieldCheck className="h-6 w-6 text-primary" /> */}
            <img src="https://ik.imagekit.io/abjshawty/logo.svg?updatedAt=1760845285737" alt="logo" className="w-10 h-10 rounded-full" />
          </div>
          <DialogTitle className="text-center text-2xl">Code d'authentification</DialogTitle>
          <DialogDescription className="text-center">
            Veuillez entrer votre code d'authentification de 6 chiffres pour continuer
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleSubmit}
            disabled={code.length !== 6 || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              'Soumettre le code'
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Veuillez entrer le code d'authentification de 6 chiffres fourni pour accéder à l'application
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
