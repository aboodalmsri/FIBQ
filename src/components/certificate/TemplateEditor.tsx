import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  GripVertical, 
  Type, 
  Image, 
  QrCode, 
  Award, 
  Minus, 
  Trash2, 
  Plus,
  Move,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { TemplateElement, CertificateTemplate, availablePlaceholders, defaultTemplateElements } from "@/types/certificate";
import { cn } from "@/lib/utils";

interface TemplateEditorProps {
  template: CertificateTemplate;
  onUpdate: (template: CertificateTemplate) => void;
}

export function TemplateEditor({ template, onUpdate }: TemplateEditorProps) {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedElement = template.elements.find((el) => el.id === selectedElementId);

  const updateElement = useCallback((elementId: string, updates: Partial<TemplateElement>) => {
    onUpdate({
      ...template,
      elements: template.elements.map((el) =>
        el.id === elementId ? { ...el, ...updates } : el
      ),
    });
  }, [template, onUpdate]);

  const addElement = (type: TemplateElement["type"]) => {
    const newElement: TemplateElement = {
      id: `element-${Date.now()}`,
      type,
      x: 50,
      y: 50,
      width: type === "text" ? 30 : type === "line" ? 20 : 10,
      height: type === "text" ? 5 : type === "line" ? 1 : 10,
      content: type === "text" ? "New Text" : undefined,
      fontSize: 16,
      fontFamily: "Inter",
      fontWeight: "normal",
      textAlign: "center",
      color: template.accentColor,
      visible: true,
    };
    onUpdate({
      ...template,
      elements: [...template.elements, newElement],
    });
    setSelectedElementId(newElement.id);
  };

  const deleteElement = (elementId: string) => {
    onUpdate({
      ...template,
      elements: template.elements.filter((el) => el.id !== elementId),
    });
    setSelectedElementId(null);
  };

  const duplicateElement = (elementId: string) => {
    const element = template.elements.find((el) => el.id === elementId);
    if (element) {
      const newElement = {
        ...element,
        id: `element-${Date.now()}`,
        x: element.x + 5,
        y: element.y + 5,
      };
      onUpdate({
        ...template,
        elements: [...template.elements, newElement],
      });
      setSelectedElementId(newElement.id);
    }
  };

  const handleDrag = (elementId: string, e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    setIsDragging(true);

    const canvas = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const element = template.elements.find((el) => el.id === elementId);
    if (!element) return;

    const startElX = element.x;
    const startElY = element.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = ((moveEvent.clientX - startX) / canvas.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / canvas.height) * 100;

      updateElement(elementId, {
        x: Math.max(0, Math.min(100, startElX + deltaX)),
        y: Math.max(0, Math.min(100, startElY + deltaY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getBorderClass = () => {
    switch (template.borderStyle) {
      case "classic": return "border-[12px] border-double";
      case "modern": return "border-4 border-solid";
      case "minimal": return "border border-solid";
      case "ornate": return "border-[16px] border-double";
      default: return "";
    }
  };

  const renderElement = (element: TemplateElement) => {
    const isSelected = selectedElementId === element.id;
    const baseStyle = {
      position: "absolute" as const,
      left: `${element.x}%`,
      top: `${element.y}%`,
      transform: "translate(-50%, -50%)",
      width: `${element.width}%`,
      cursor: isDragging ? "grabbing" : "grab",
    };

    const content = element.placeholder 
      ? `{{${element.placeholder}}}` 
      : element.content;

    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              fontSize: `${element.fontSize}px`,
              fontFamily: element.fontFamily === "monospace" ? "monospace" : element.fontFamily,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textAlign: element.textAlign,
              color: element.color,
            }}
            className={cn(
              "select-none whitespace-pre-wrap",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            onClick={() => setSelectedElementId(element.id)}
            onMouseDown={(e) => handleDrag(element.id, e)}
          >
            {content || "Text Element"}
          </div>
        );

      case "image":
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              height: `${element.height}%`,
            }}
            className={cn(
              "border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            onClick={() => setSelectedElementId(element.id)}
            onMouseDown={(e) => handleDrag(element.id, e)}
          >
            <div className="text-center text-muted-foreground text-xs">
              <Image className="h-6 w-6 mx-auto mb-1" />
              <span>{element.placeholder || "Image"}</span>
            </div>
          </div>
        );

      case "qrcode":
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              height: `${element.height}%`,
            }}
            className={cn(
              "border-2 border-dashed rounded flex items-center justify-center bg-muted/30",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            onClick={() => setSelectedElementId(element.id)}
            onMouseDown={(e) => handleDrag(element.id, e)}
          >
            <QrCode className="h-8 w-8 text-muted-foreground" />
          </div>
        );

      case "seal":
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              height: `${element.height}%`,
            }}
            className={cn(
              "border-4 border-dashed rounded-full flex items-center justify-center",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            onClick={() => setSelectedElementId(element.id)}
            onMouseDown={(e) => handleDrag(element.id, e)}
          >
            <Award className="h-8 w-8" style={{ color: template.accentColor }} />
          </div>
        );

      case "line":
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              height: "2px",
              backgroundColor: element.color || template.accentColor,
            }}
            className={cn(
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            onClick={() => setSelectedElementId(element.id)}
            onMouseDown={(e) => handleDrag(element.id, e)}
          />
        );

      case "logo":
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              height: `${element.height}%`,
            }}
            className={cn(
              "border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30",
              isSelected && "ring-2 ring-blue-500 ring-offset-2"
            )}
            onClick={() => setSelectedElementId(element.id)}
            onMouseDown={(e) => handleDrag(element.id, e)}
          >
            <div className="text-center text-muted-foreground text-xs">
              <Award className="h-6 w-6 mx-auto mb-1" />
              <span>Logo</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Canvas */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Template Canvas</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => addElement("text")}>
                  <Type className="h-4 w-4 mr-1" /> Text
                </Button>
                <Button variant="outline" size="sm" onClick={() => addElement("image")}>
                  <Image className="h-4 w-4 mr-1" /> Image
                </Button>
                <Button variant="outline" size="sm" onClick={() => addElement("line")}>
                  <Minus className="h-4 w-4 mr-1" /> Line
                </Button>
                <Button variant="outline" size="sm" onClick={() => addElement("qrcode")}>
                  <QrCode className="h-4 w-4 mr-1" /> QR
                </Button>
                <Button variant="outline" size="sm" onClick={() => addElement("seal")}>
                  <Award className="h-4 w-4 mr-1" /> Seal
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-auto border rounded-lg bg-muted/20 p-4">
              <div
                ref={canvasRef}
                className={cn(
                  "relative mx-auto",
                  getBorderClass()
                )}
                style={{
                  width: `${template.width}px`,
                  height: `${template.height}px`,
                  backgroundColor: template.backgroundColor,
                  borderColor: template.accentColor,
                  backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: "scale(0.7)",
                  transformOrigin: "top center",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setSelectedElementId(null);
                  }
                }}
              >
                {template.elements.map(renderElement)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Click and drag elements to reposition. Click to select and edit properties.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Panel */}
      <div className="space-y-4">
        {/* Template Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Template Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input
                value={template.name}
                onChange={(e) => onUpdate({ ...template, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={template.backgroundColor}
                    onChange={(e) => onUpdate({ ...template, backgroundColor: e.target.value })}
                    className="h-10 w-14 p-1 cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={template.accentColor}
                    onChange={(e) => onUpdate({ ...template, accentColor: e.target.value })}
                    className="h-10 w-14 p-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Border Style</Label>
              <Select
                value={template.borderStyle}
                onValueChange={(value: CertificateTemplate["borderStyle"]) =>
                  onUpdate({ ...template, borderStyle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="classic">Classic (Double)</SelectItem>
                  <SelectItem value="modern">Modern (Solid)</SelectItem>
                  <SelectItem value="minimal">Minimal (Thin)</SelectItem>
                  <SelectItem value="ornate">Ornate (Thick)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Background Image URL</Label>
              <Input
                placeholder="https://..."
                value={template.backgroundImage || ""}
                onChange={(e) => onUpdate({ ...template, backgroundImage: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Element Properties */}
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Element Properties</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => duplicateElement(selectedElement.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteElement(selectedElement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedElement.type === "text" && (
                  <>
                    <div className="space-y-2">
                      <Label>Content Type</Label>
                      <Select
                        value={selectedElement.placeholder ? "placeholder" : "static"}
                        onValueChange={(value) => {
                          if (value === "static") {
                            updateElement(selectedElement.id, { placeholder: undefined, content: "Text" });
                          } else {
                            updateElement(selectedElement.id, { content: undefined, placeholder: "traineeName" });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="static">Static Text</SelectItem>
                          <SelectItem value="placeholder">Data Field</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedElement.placeholder ? (
                      <div className="space-y-2">
                        <Label>Data Field</Label>
                        <Select
                          value={selectedElement.placeholder}
                          onValueChange={(value) => updateElement(selectedElement.id, { placeholder: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePlaceholders.map((p) => (
                              <SelectItem key={p.key} value={p.key}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Text Content</Label>
                        <Input
                          value={selectedElement.content || ""}
                          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Input
                          type="number"
                          value={selectedElement.fontSize || 16}
                          onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Font Weight</Label>
                        <Select
                          value={selectedElement.fontWeight || "normal"}
                          onValueChange={(value: TemplateElement["fontWeight"]) =>
                            updateElement(selectedElement.id, { fontWeight: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="semibold">Semibold</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select
                          value={selectedElement.fontFamily || "Inter"}
                          onValueChange={(value) => updateElement(selectedElement.id, { fontFamily: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                            <SelectItem value="monospace">Monospace</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Text Align</Label>
                        <Select
                          value={selectedElement.textAlign || "center"}
                          onValueChange={(value: TemplateElement["textAlign"]) =>
                            updateElement(selectedElement.id, { textAlign: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={selectedElement.color || "#000000"}
                          onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                          className="h-10 w-14 p-1 cursor-pointer"
                        />
                        <Input
                          value={selectedElement.color || "#000000"}
                          onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                          className="font-mono flex-1"
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedElement.type === "image" && (
                  <div className="space-y-2">
                    <Label>Image Placeholder</Label>
                    <Select
                      value={selectedElement.placeholder || "traineePhoto"}
                      onValueChange={(value) => updateElement(selectedElement.id, { placeholder: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traineePhoto">Trainee/Trainer Photo</SelectItem>
                        <SelectItem value="centerLogo">Center Logo</SelectItem>
                        <SelectItem value="customImage">Custom Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Position Controls */}
                <div className="pt-2 border-t">
                  <Label className="mb-3 block">Position & Size</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">X Position (%)</Label>
                      <Slider
                        value={[selectedElement.x]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={([value]) => updateElement(selectedElement.id, { x: value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Y Position (%)</Label>
                      <Slider
                        value={[selectedElement.y]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={([value]) => updateElement(selectedElement.id, { y: value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Width (%)</Label>
                      <Slider
                        value={[selectedElement.width]}
                        min={5}
                        max={100}
                        step={1}
                        onValueChange={([value]) => updateElement(selectedElement.id, { width: value })}
                      />
                    </div>
                    {(selectedElement.type !== "text" && selectedElement.type !== "line") && (
                      <div className="space-y-2">
                        <Label className="text-xs">Height (%)</Label>
                        <Slider
                          value={[selectedElement.height || 10]}
                          min={5}
                          max={50}
                          step={1}
                          onValueChange={([value]) => updateElement(selectedElement.id, { height: value })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Elements List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {template.elements.map((element) => (
                <div
                  key={element.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                    selectedElementId === element.id
                      ? "bg-secondary/20 border border-secondary"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                  onClick={() => setSelectedElementId(element.id)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  {element.type === "text" && <Type className="h-4 w-4" />}
                  {element.type === "image" && <Image className="h-4 w-4" />}
                  {element.type === "qrcode" && <QrCode className="h-4 w-4" />}
                  {element.type === "seal" && <Award className="h-4 w-4" />}
                  {element.type === "line" && <Minus className="h-4 w-4" />}
                  {element.type === "logo" && <Award className="h-4 w-4" />}
                  <span className="text-sm truncate flex-1">
                    {element.placeholder || element.content || element.type}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
