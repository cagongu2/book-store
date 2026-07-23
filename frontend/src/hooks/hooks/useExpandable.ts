import { useState, useEffect, useRef } from "react";

interface UseExpandableOptions {
  content?: string | null;
  isMobile?: boolean;
}

export const useExpandable = ({ content, isMobile }: UseExpandableOptions) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [showExpand, setShowExpand] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (!contentRef.current) return;

      setShowExpand(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    };

    requestAnimationFrame(checkOverflow);

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [content, isMobile]);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const clampClass = expanded
    ? ""
    : isMobile
      ? "line-clamp-9"
      : "line-clamp-3";

  return {
    contentRef,
    expanded,
    showExpand,
    toggleExpanded,
    clampClass,
  };
};
