"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export const BackgroundBeamsWithCollision = ({ children }) => {
  return (
    <Card className="relative bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 100%)" }}
      />
      <CardContent className="relative z-10">{children}</CardContent>
    </Card>
  );
};