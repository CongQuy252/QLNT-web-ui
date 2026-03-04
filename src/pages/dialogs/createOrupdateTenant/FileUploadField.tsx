import { useEffect, useMemo, useRef } from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { MdOutlineFileUpload } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface FileUploadFieldProps<T extends FieldValues> {
  label: string;
  field: ControllerRenderProps<T, Path<T>>;
}

const isFile = (value: unknown): value is File =>
  typeof value === 'object' && value !== null && value instanceof File;

export function FileUploadField<T extends FieldValues>({ label, field }: FileUploadFieldProps<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) field.onChange(file);

    // 👉 cho phép chọn lại cùng file
    e.target.value = '';
  };

  // tạo preview URL
  const previewUrl = useMemo(() => {
    const value = field.value as unknown;

    if (!value) return null;

    if (isFile(value)) return URL.createObjectURL(value);

    if (typeof value === 'string') return value;

    return null;
  }, [field.value]);

  // cleanup object URL
  useEffect(() => {
    const value = field.value;

    return () => {
      if (isFile(value) && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, field.value]);

  const fileName = useMemo(() => {
    const value = field.value as unknown;

    if (!value) return '';

    if (isFile(value)) return value.name;

    if (typeof value === 'string') {
      return value.split('/').pop() ?? '';
    }

    return '';
  }, [field.value]);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>

      <FormControl>
        <div className="space-y-3">
          {/* preview ảnh */}
          {previewUrl && (
            <img src={previewUrl} alt="preview" className="h-28 rounded-lg border object-cover" />
          )}

          {/* chọn file */}
          <div className="flex flex-col items-baseline gap-3">
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              <MdOutlineFileUpload className="w-4 h-4" />
            </Button>

            <span className="text-sm text-muted-foreground">{fileName || 'Chưa chọn file'}</span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Chọn file ảnh"
          />
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  );
}
