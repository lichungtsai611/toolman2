import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BaseSystem {
  name: string;
  base: number;
  validate: (value: string) => boolean;
}

@Component({
  selector: 'app-base-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './base-converter.component.html'
})
export class BaseConverterComponent {
  baseSystems: BaseSystem[] = [
    {
      name: '二進位',
      base: 2,
      validate: (value: string) => /^[01]+$/.test(value)
    },
    {
      name: '八進位',
      base: 8,
      validate: (value: string) => /^[0-7]+$/.test(value)
    },
    {
      name: '十進位',
      base: 10,
      validate: (value: string) => /^[0-9]+$/.test(value)
    },
    {
      name: '十六進位',
      base: 16,
      validate: (value: string) => /^[0-9A-Fa-f]+$/.test(value)
    }
  ];

  fromBase: BaseSystem = this.baseSystems[2]; // 預設十進位
  toBase: BaseSystem = this.baseSystems[0];   // 預設轉二進位
  fromValue: string = '';
  toValue: string = '';
  isValidInput: boolean = true;

  commonConversions = [
    { from: this.baseSystems[2], to: this.baseSystems[0] }, // 十進位到二進位
    { from: this.baseSystems[2], to: this.baseSystems[3] }, // 十進位到十六進位
    { from: this.baseSystems[0], to: this.baseSystems[3] }, // 二進位到十六進位
    { from: this.baseSystems[3], to: this.baseSystems[0] }  // 十六進位到二進位
  ];

  convert() {
    if (!this.fromValue) {
      this.toValue = '';
      this.isValidInput = true;
      return;
    }

    // 驗證輸入
    this.isValidInput = this.fromBase.validate(this.fromValue);
    if (!this.isValidInput) {
      this.toValue = '';
      return;
    }

    try {
      // 先轉換為十進位
      const decimal = parseInt(this.fromValue, this.fromBase.base);
      // 再轉換為目標進位
      this.toValue = decimal.toString(this.toBase.base).toUpperCase();
    } catch (error) {
      this.toValue = '';
      this.isValidInput = false;
    }
  }

  usePreset(preset: { from: BaseSystem, to: BaseSystem }) {
    this.fromBase = preset.from;
    this.toBase = preset.to;
    this.convert();
  }
}
