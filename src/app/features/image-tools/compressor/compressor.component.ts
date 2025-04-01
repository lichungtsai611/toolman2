import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ImageFile {
  file: File;
  preview: string;
  name: string;
  size: number;
  compressedSize?: number;
  compressedUrl?: string;
}

@Component({
  selector: 'app-compressor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">圖片壓縮工具</h1>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <!-- 拖放區域 -->
          <div 
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6"
            [ngClass]="{'border-primary': isDragging}"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
          >
            <div class="space-y-4">
              <i class="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
              <p class="text-gray-600 dark:text-gray-300">
                拖放圖片到這裡，或
                <label class="text-primary hover:text-primary-dark cursor-pointer">
                  <input
                    type="file"
                    class="hidden"
                    accept="image/*"
                    multiple
                    (change)="onFileSelected($event)"
                  >
                  點擊上傳
                </label>
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                支援的格式：JPG, PNG, GIF, WebP
              </p>
            </div>
          </div>

          <!-- 壓縮設置 -->
          <div class="mb-6" *ngIf="selectedFiles.length > 0">
            <h3 class="text-lg font-semibold mb-4">壓縮設置</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">
                  品質 ({{ quality }}%)
                </label>
                <input
                  type="range"
                  [(ngModel)]="quality"
                  min="1"
                  max="100"
                  class="w-full"
                >
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">
                  最大寬度 ({{ maxWidth }}px)
                </label>
                <input
                  type="range"
                  [(ngModel)]="maxWidth"
                  min="100"
                  max="4096"
                  step="100"
                  class="w-full"
                >
              </div>
            </div>
          </div>

          <!-- 文件列表 -->
          <div *ngIf="selectedFiles.length > 0">
            <h3 class="text-lg font-semibold mb-4">已選擇的文件</h3>
            <div class="space-y-4">
              <div *ngFor="let file of selectedFiles; let i = index" class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="flex items-center space-x-4">
                  <img [src]="file.preview" class="w-16 h-16 object-cover rounded">
                  <div>
                    <p class="font-medium">{{ file.name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      原始大小：{{ formatFileSize(file.size) }}
                    </p>
                  </div>
                </div>
                <button
                  class="text-red-500 hover:text-red-600"
                  (click)="removeFile(i)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="mt-6 flex justify-end space-x-4" *ngIf="selectedFiles.length > 0">
            <button
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              (click)="clearFiles()"
            >
              清除全部
            </button>
            <button
              class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              (click)="compressImages()"
              [disabled]="isCompressing"
            >
              {{ isCompressing ? '壓縮中...' : '開始壓縮' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CompressorComponent {
  selectedFiles: ImageFile[] = [];
  isDragging = false;
  isCompressing = false;
  quality = 80;
  maxWidth = 1920;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  handleFiles(files: FileList): void {
    Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.selectedFiles.push({
            file,
            preview: e.target?.result as string,
            name: file.name,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      });
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  clearFiles(): void {
    this.selectedFiles = [];
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async compressImages(): Promise<void> {
    this.isCompressing = true;

    try {
      for (const imageFile of this.selectedFiles) {
        const compressedBlob = await this.compressImage(imageFile.file);
        imageFile.compressedSize = compressedBlob.size;
        imageFile.compressedUrl = URL.createObjectURL(compressedBlob);
        
        // 自動下載壓縮後的圖片
        const link = document.createElement('a');
        link.href = imageFile.compressedUrl;
        link.download = `compressed_${imageFile.name}`;
        link.click();
      }
    } catch (error) {
      console.error('壓縮圖片時發生錯誤:', error);
      // TODO: 添加錯誤提示
    } finally {
      this.isCompressing = false;
    }
  }

  private compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 調整尺寸
        if (width > this.maxWidth) {
          height = Math.round((height * this.maxWidth) / width);
          width = this.maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('無法獲取 canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('圖片壓縮失敗'));
            }
          },
          file.type,
          this.quality / 100
        );
      };

      img.onerror = () => {
        reject(new Error('圖片載入失敗'));
      };
    });
  }
} 