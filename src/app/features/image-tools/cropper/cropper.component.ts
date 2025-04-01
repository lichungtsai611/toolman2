import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ImageFile {
  file: File;
  preview: string;
  name: string;
  size: number;
  croppedUrl?: string;
}

@Component({
  selector: 'app-cropper',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">圖片裁剪工具</h1>
        
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

          <!-- 裁剪區域 -->
          <div *ngIf="selectedFile" class="mb-6">
            <h3 class="text-lg font-semibold mb-4">裁剪設置</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">寬度 (px)</label>
                  <input
                    type="number"
                    [(ngModel)]="cropWidth"
                    class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    min="1"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">高度 (px)</label>
                  <input
                    type="number"
                    [(ngModel)]="cropHeight"
                    class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    min="1"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">預設比例</label>
                <select
                  [(ngModel)]="aspectRatio"
                  class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  (change)="onAspectRatioChange()"
                >
                  <option value="free">自由比例</option>
                  <option value="1:1">1:1 (正方形)</option>
                  <option value="4:3">4:3</option>
                  <option value="16:9">16:9</option>
                  <option value="3:4">3:4</option>
                  <option value="9:16">9:16</option>
                </select>
              </div>
            </div>

            <!-- 預覽區域 -->
            <div class="mt-6">
              <div class="relative">
                <img
                  [src]="selectedFile.preview"
                  class="max-w-full h-auto"
                  #previewImage
                >
                <!-- TODO: 添加可拖動的裁剪框 -->
              </div>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="mt-6 flex justify-end space-x-4" *ngIf="selectedFile">
            <button
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              (click)="clearFile()"
            >
              清除
            </button>
            <button
              class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              (click)="cropImage()"
              [disabled]="isCropping"
            >
              {{ isCropping ? '裁剪中...' : '開始裁剪' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CropperComponent {
  selectedFile: ImageFile | null = null;
  isDragging = false;
  isCropping = false;
  cropWidth = 800;
  cropHeight = 600;
  aspectRatio = 'free';

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
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedFile = {
          file,
          preview: e.target?.result as string,
          name: file.name,
          size: file.size
        };
      };
      reader.readAsDataURL(file);
    }
  }

  clearFile(): void {
    this.selectedFile = null;
  }

  onAspectRatioChange(): void {
    if (this.aspectRatio === 'free') return;

    const [width, height] = this.aspectRatio.split(':').map(Number);
    if (this.cropWidth && width && height) {
      this.cropHeight = Math.round((this.cropWidth * height) / width);
    }
  }

  async cropImage(): Promise<void> {
    if (!this.selectedFile) return;

    this.isCropping = true;

    try {
      const croppedBlob = await this.performCrop(this.selectedFile.file);
      this.selectedFile.croppedUrl = URL.createObjectURL(croppedBlob);
      
      // 自動下載裁剪後的圖片
      const link = document.createElement('a');
      link.href = this.selectedFile.croppedUrl;
      link.download = `cropped_${this.selectedFile.name}`;
      link.click();
    } catch (error) {
      console.error('裁剪圖片時發生錯誤:', error);
      // TODO: 添加錯誤提示
    } finally {
      this.isCropping = false;
    }
  }

  private performCrop(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = this.cropWidth;
        canvas.height = this.cropHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('無法獲取 canvas context'));
          return;
        }

        // 計算裁剪區域
        const scale = Math.min(
          this.cropWidth / img.width,
          this.cropHeight / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (this.cropWidth - scaledWidth) / 2;
        const y = (this.cropHeight - scaledHeight) / 2;

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('圖片裁剪失敗'));
            }
          },
          'image/jpeg',
          1.0
        );
      };

      img.onerror = () => {
        reject(new Error('圖片載入失敗'));
      };
    });
  }
} 