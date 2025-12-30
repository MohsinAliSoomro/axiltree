// Animation options
export const animationOptions = [
  {
    value: "none",
    label: "None",
    icon: "⚪",
    description: "No Animation",
  },
  {
    value: "fade",
    label: "Fade In",
    icon: "✨",
    description: "Fade In",
  },
  {
    value: "slide-up",
    label: "Slide Up",
    icon: "⬆️",
    description: "Slide Up",
  },
  {
    value: "slide-down",
    label: "Slide Down",
    icon: "⬇️",
    description: "Slide Down",
  },
  {
    value: "slide-left",
    label: "Slide Left",
    icon: "⬅️",
    description: "Slide Left",
  },
  {
    value: "slide-right",
    label: "Slide Right",
    icon: "➡️",
    description: "Slide Right",
  },
  {
    value: "bounce",
    label: "Bounce",
    icon: "🔴",
    description: "Bounce",
  },
  {
    value: "scale",
    label: "Scale",
    icon: "🔍",
    description: "Scale",
  },
  {
    value: "rotate",
    label: "Rotate",
    icon: "🔄",
    description: "Rotate",
  },
  {
    value: "flip",
    label: "Flip",
    icon: "🔄",
    description: "Flip",
  },
  {
    value: "zoom-in",
    label: "Zoom In",
    icon: "🔍",
    description: "Zoom In",
  },
  {
    value: "zoom-out",
    label: "Zoom Out",
    icon: "🔍",
    description: "Zoom Out",
  },
  {
    value: "shake",
    label: "Shake",
    icon: "📳",
    description: "Shake",
  },
  {
    value: "pulse",
    label: "Pulse",
    icon: "💓",
    description: "Pulse",
  },
  {
    value: "wiggle",
    label: "Wiggle",
    icon: "〰️",
    description: "Wiggle",
  },
  {
    value: "glow",
    label: "Glow",
    icon: "✨",
    description: "Glow",
  },
  {
    value: "float",
    label: "Float",
    icon: "☁️",
    description: "Float",
  },
  {
    value: "elastic",
    label: "Elastic",
    icon: "🔗",
    description: "Elastic",
  },
  {
    value: "spring",
    label: "Spring",
    icon: "🌱",
    description: "Spring",
  },
  {
    value: "fade-up",
    label: "Fade Up",
    icon: "⬆️✨",
    description: "Fade Up",
  },
  {
    value: "fade-down",
    label: "Fade Down",
    icon: "⬇️✨",
    description: "Fade Down",
  },
  {
    value: "fade-left",
    label: "Fade Left",
    icon: "⬅️✨",
    description: "Fade Left",
  },
  {
    value: "fade-right",
    label: "Fade Right",
    icon: "➡️✨",
    description: "Fade Right",
  },
  {
    value: "spin",
    label: "Spin",
    icon: "🌀",
    description: "Spin",
  },
  {
    value: "rubber",
    label: "Rubber",
    icon: "🔲",
    description: "Rubber",
  },
  {
    value: "swing",
    label: "Swing",
    icon: "🎯",
    description: "Swing",
  },
  {
    value: "tada",
    label: "Tada",
    icon: "🎉",
    description: "Tada",
  },
  {
    value: "heartbeat",
    label: "Heartbeat",
    icon: "❤️",
    description: "Heartbeat",
  },
  {
    value: "flash",
    label: "Flash",
    icon: "⚡",
    description: "Flash",
  },
  {
    value: "slide-rotate",
    label: "Slide Rotate",
    icon: "🔄⬆️",
    description: "Slide Rotate",
  },
  {
    value: "zoom-rotate",
    label: "Zoom Rotate",
    icon: "🔍🔄",
    description: "Zoom Rotate",
  },
];

// Get animation variants for framer-motion
export const getAnimationVariants = (animationType: string) => {
  const baseVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  };

  switch (animationType) {
    case "none":
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 },
      };
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 },
      };
    case "slide-up":
      return {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };
    case "slide-down":
      return {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };
    case "slide-left":
      return {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };
    case "slide-right":
      return {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };
    case "bounce":
      return {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 20,
        },
      };
    case "scale":
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
      };
    case "rotate":
      return {
        initial: { opacity: 0, rotate: -180 },
        animate: { opacity: 1, rotate: 0 },
        transition: { duration: 0.6 },
      };
    case "flip":
      return {
        initial: { opacity: 0, rotateY: -90 },
        animate: { opacity: 1, rotateY: 0 },
        transition: { duration: 0.6 },
      };
    case "zoom-in":
      return {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
      };
    case "zoom-out":
      return {
        initial: { opacity: 0, scale: 1.5 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
      };
    case "shake":
      return {
        initial: { x: 0 },
        animate: {
          x: [0, -10, 10, -10, 10, 0],
          opacity: 1,
        },
        transition: {
          duration: 0.5,
          opacity: { duration: 0.3 },
        },
      };
    case "pulse":
      return {
        initial: { opacity: 0, scale: 0.9 },
        animate: {
          opacity: 1,
          scale: 1.05,
        },
        transition: {
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse" as const,
          repeatDelay: 1,
        },
      };
    case "wiggle":
      return {
        initial: { rotate: 0 },
        animate: {
          rotate: [0, -5, 5, -5, 5, 0],
          opacity: 1,
        },
        transition: {
          duration: 0.5,
          opacity: { duration: 0.3 },
        },
      };
    case "glow":
      return {
        initial: { opacity: 0, boxShadow: "0 0 0px rgba(255,255,255,0)" },
        animate: {
          opacity: 1,
          boxShadow: [
            "0 0 0px rgba(255,255,255,0)",
            "0 0 20px rgba(255,255,255,0.5)",
            "0 0 0px rgba(255,255,255,0)",
          ],
        },
        transition: {
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      };
    case "float":
      return {
        initial: { opacity: 0, y: 0 },
        animate: {
          opacity: 1,
          y: [0, -10, 0],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: [0.4, 0, 0.6, 1] as const,
        },
      };
    case "elastic":
      return {
        initial: { opacity: 0, scale: 0 },
        animate: {
          opacity: 1,
          scale: 1,
        },
        transition: {
          type: "spring" as const,
          stiffness: 200,
          damping: 10,
          bounce: 0.5,
        },
      };
    case "spring":
      return {
        initial: { opacity: 0, y: 50 },
        animate: {
          opacity: 1,
          y: 0,
        },
        transition: {
          type: "spring" as const,
          stiffness: 100,
          damping: 15,
        },
      };
    case "fade-up":
      return {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };
    case "fade-down":
      return {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };
    case "fade-left":
      return {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };
    case "fade-right":
      return {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };
    case "spin":
      return {
        initial: { opacity: 0, rotate: -360 },
        animate: {
          opacity: 1,
          rotate: 0,
        },
        transition: { duration: 0.8 },
      };
    case "rubber":
      return {
        initial: { opacity: 0, scale: 0 },
        animate: {
          opacity: 1,
          scale: [0, 1.25, 0.9, 1.1, 1],
        },
        transition: {
          duration: 0.8,
          times: [0, 0.4, 0.6, 0.8, 1],
        },
      };
    case "swing":
      return {
        initial: { opacity: 0, rotate: -15 },
        animate: {
          opacity: 1,
          rotate: [0, 15, -15, 15, -15, 0],
        },
        transition: {
          duration: 0.8,
          opacity: { duration: 0.3 },
        },
      };
    case "tada":
      return {
        initial: { opacity: 0, scale: 0 },
        animate: {
          opacity: 1,
          scale: [0, 1.1, 0.9, 1.1, 0.9, 1],
          rotate: [0, -3, 3, -3, 3, 0],
        },
        transition: {
          duration: 0.8,
          opacity: { duration: 0.3 },
        },
      };
    case "heartbeat":
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: {
          opacity: 1,
          scale: [1, 1.2, 1, 1.2, 1],
        },
        transition: {
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 0.5,
        },
      };
    case "flash":
      return {
        initial: { opacity: 0 },
        animate: {
          opacity: [0, 1, 0, 1, 1],
        },
        transition: {
          duration: 0.6,
          times: [0, 0.25, 0.5, 0.75, 1],
        },
      };
    case "slide-rotate":
      return {
        initial: { opacity: 0, y: 50, rotate: -180 },
        animate: {
          opacity: 1,
          y: 0,
          rotate: 0,
        },
        transition: { duration: 0.7 },
      };
    case "zoom-rotate":
      return {
        initial: { opacity: 0, scale: 0.5, rotate: -180 },
        animate: {
          opacity: 1,
          scale: 1,
          rotate: 0,
        },
        transition: { duration: 0.7 },
      };
    default:
      return baseVariants;
  }
};

