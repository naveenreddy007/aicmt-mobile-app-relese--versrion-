"use client"

import { useState, useRef } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle markdown formatting
  const handleFormat = (format: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    let replacement = ""

    switch (format) {
      case "bold":
        replacement = `**${selectedText}**`
        break
      case "italic":
        replacement = `*${selectedText}*`
        break
      case "ul":
        replacement = selectedText
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n")
        break
      case "ol":
        replacement = selectedText
          .split("\n")
          .map((line, i) => `${i + 1}. ${line}`)
          .join("\n")
        break
      case "link":
        replacement = `[${selectedText}](url)`
        break
      case "image":
        replacement = `![${selectedText || "alt text"}](url)`
        break
      case "h1":
        replacement = `# ${selectedText}`
        break
      case "h2":
        replacement = `## ${selectedText}`
        break
      case "h3":
        replacement = `### ${selectedText}`
        break
      case "quote":
        replacement = `> ${selectedText}`
        break
      case "code":
        replacement = `\`\`\`\n${selectedText}\n\`\`\``
        break
      default:
        break
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)

    // Set cursor position after the inserted markdown
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + replacement.length, start + replacement.length)
    }, 0)
  }

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    const html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Lists
      .replace(/^\s*- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^\s*\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      // Links and Images
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" class="max-w-full h-auto my-2 rounded" />')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="pl-4 border-l-4 border-gray-300 italic">$1</blockquote>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-2 rounded my-2 overflow-x-auto"><code>$1</code></pre>')
      // Line breaks
      .replace(/\n/g, "<br />")

    return html
  }

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="flex items-center gap-1 p-1 border-b bg-muted/50">
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("bold")} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("italic")} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("h1")} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("h2")} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("h3")} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("ul")} title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("ol")} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("link")} title="Link">
          <Link className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("image")} title="Image">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("quote")} title="Quote">
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("code")} title="Code Block">
          <Code className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "write" | "preview")}>
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="min-h-[300px]">
        {tab === "write" ? (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[300px] border-0 focus-visible:ring-0 resize-none"
            placeholder="Write your content here..."
          />
        ) : (
          <div
            className="prose prose-sm max-w-none p-4 min-h-[300px] overflow-auto"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
          />
        )}
      </div>
    </div>
  )
}
