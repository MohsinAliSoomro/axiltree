'use client';

import { Button, ButtonProps } from '@mantine/core';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react'; // optional: for loading state

interface CustomButtonProps extends ButtonProps {
  children: ReactNode;
  loading?: boolean;        // loading state dikhane ke liye
  icon?: ReactNode;         // left icon (optional)
  rightIcon?: ReactNode;    // right icon (optional)
}

export default function CustomButton({
  children,
  loading = false,
  icon,
  rightIcon,
  disabled,
  ...restProps
}: CustomButtonProps) {
  return (
    <Button
      leftSection={loading ? <Loader2 size={18} className="animate-spin" /> : icon}
      rightSection={rightIcon}
      loading={loading} // Mantine ka built-in loading (overlay + disabled)
      disabled={loading || disabled} // loading mein button disable ho jaaye
      loaderProps={{ size: 18 }} // optional: loader size
      {...restProps}
    >
      {children}
    </Button>
  );
}