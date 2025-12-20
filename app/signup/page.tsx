'use client'
import { Button, Divider, Paper, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { AlertCircle, Anchor, Camera, Container, Group, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setErrors({});
    
    // Validation
    const newErrors:any = {};
    if (!formData.name.trim()) newErrors.name = 'Name zaruri hai';
    if (!formData.email.trim()) newErrors.email = 'Email zaruri hai';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email dalein';
    if (!formData.password) newErrors.password = 'Password zaruri hai';
    else if (formData.password.length < 6) newErrors.password = 'Password kam se kam 6 characters ka hona chahiye';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Signup successful! 🎉');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    alert('Google login integration...');
  };

  return (
    <Container size="xs" style={{ width: '100%', maxWidth: '440px' }}>
      <Stack gap="xl" align="center">
        {/* Logo */}
        <Group>
          <Camera size={32} color="white" />
          <Text size="2rem" fw={700} style={{ color: 'white' }}>LinkHub</Text>
        </Group>

        {/* Auth Card */}
        <Paper 
          shadow="xl" 
          radius="lg"
          style={{ 
            width: '100%',
            padding: '2.5rem 2rem',
            background: 'white'
          }}
        >
          <Stack gap="xl">
            <div>
              <Text size="1.75rem" fw={700} style={{ color: '#262626', marginBottom: '0.5rem' }}>
                Account Banao
              </Text>
              <Text size="sm" c="dimmed">
                Apna link-in-bio page shuru karein
              </Text>
            </div>

            <Stack gap="md">
              {/* Name Input */}
              <div>
                <TextInput
                  size="md"
                  placeholder="Apna naam"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  error={errors.name}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  styles={{
                    input: {
                      borderColor: errors.name ? '#fa5252' : '#dee2e6',
                      '&:focus': { borderColor: '#667eea' }
                    }
                  }}
                />
                {errors.name && (
                  <Group  style={{ marginTop: '0.5rem' }}>
                    <AlertCircle size={14} color="#fa5252" />
                    <Text size="xs" c="red">{errors.name}</Text>
                  </Group>
                )}
              </div>

              {/* Email Input */}
              <div>
                <TextInput
                  size="md"
                  placeholder="Email address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  error={errors.email}
                  leftSection={<Mail size={18} />}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  styles={{
                    input: {
                      borderColor: errors.email ? '#fa5252' : '#dee2e6',
                      '&:focus': { borderColor: '#667eea' }
                    }
                  }}
                />
                {errors.email && (
                  <Group  style={{ marginTop: '0.5rem' }}>
                    <AlertCircle size={14} color="#fa5252" />
                    <Text size="xs" c="red">{errors.email}</Text>
                  </Group>
                )}
              </div>

              {/* Password Input */}
              <div>
                <PasswordInput
                  size="md"
                  placeholder="Password (6+ characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  error={errors.password}
                  leftSection={<Lock size={18} />}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  styles={{
                    input: {
                      borderColor: errors.password ? '#fa5252' : '#dee2e6',
                      '&:focus': { borderColor: '#667eea' }
                    }
                  }}
                />
                {errors.password && (
                  <Group  style={{ marginTop: '0.5rem' }}>
                    <AlertCircle size={14} color="#fa5252" />
                    <Text size="xs" c="red">{errors.password}</Text>
                  </Group>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                size="md"
                fullWidth
                loading={loading}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  marginTop: '0.5rem'
                }}
              >
                Sign Up
              </Button>
            </Stack>

            <Divider label="ya" labelPosition="center" />

            {/* Google Login */}
            <Button
              size="md"
              fullWidth
              variant="outline"
              onClick={handleGoogleLogin}
              style={{
                borderColor: '#dee2e6',
                color: '#262626'
              }}
              leftSection={
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
            >
              Continue with Google
            </Button>

            {/* Switch to Login */}
            <Text size="sm" ta="center" c="dimmed">
              Pehle se account hai?{' '}
              <Anchor
                type="button"
                onClick={() => {}}
                style={{ 
                  color: '#667eea',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Login karein
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}