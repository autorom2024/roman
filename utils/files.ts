// utils/files.ts

export const sanitizeFilename = (name: string): string => {
    let sane = (name || "").trim().replace(/[/\\]/g, "-");
    sane = sane.replace(/[^0-9A-Za-zА-Яа-яҐґЄєІіЇї _\-\.\(\)\[\]]+/gu, "");
    sane = sane.replace(/\s+/g, " ").trim();
    return sane || "untitled";
};

export const downloadBlob = (blob: Blob, name: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};
