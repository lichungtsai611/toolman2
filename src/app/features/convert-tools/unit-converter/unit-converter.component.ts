import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UnitCategory {
  name: string;
  units: Unit[];
}

interface Unit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

@Component({
  selector: 'app-unit-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unit-converter.component.html'
})
export class UnitConverterComponent {
  categories: UnitCategory[] = [
    {
      name: '長度',
      units: [
        {
          name: '公里',
          symbol: 'km',
          toBase: (v: number) => v * 1000,
          fromBase: (v: number) => v / 1000
        },
        {
          name: '公尺',
          symbol: 'm',
          toBase: (v: number) => v,
          fromBase: (v: number) => v
        },
        {
          name: '公分',
          symbol: 'cm',
          toBase: (v: number) => v / 100,
          fromBase: (v: number) => v * 100
        },
        {
          name: '公釐',
          symbol: 'mm',
          toBase: (v: number) => v / 1000,
          fromBase: (v: number) => v * 1000
        },
        {
          name: '英里',
          symbol: 'mi',
          toBase: (v: number) => v * 1609.344,
          fromBase: (v: number) => v / 1609.344
        },
        {
          name: '英呎',
          symbol: 'ft',
          toBase: (v: number) => v * 0.3048,
          fromBase: (v: number) => v / 0.3048
        },
        {
          name: '英吋',
          symbol: 'in',
          toBase: (v: number) => v * 0.0254,
          fromBase: (v: number) => v / 0.0254
        }
      ]
    },
    {
      name: '重量',
      units: [
        {
          name: '公噸',
          symbol: 't',
          toBase: (v: number) => v * 1000,
          fromBase: (v: number) => v / 1000
        },
        {
          name: '公斤',
          symbol: 'kg',
          toBase: (v: number) => v,
          fromBase: (v: number) => v
        },
        {
          name: '公克',
          symbol: 'g',
          toBase: (v: number) => v / 1000,
          fromBase: (v: number) => v * 1000
        },
        {
          name: '磅',
          symbol: 'lb',
          toBase: (v: number) => v * 0.45359237,
          fromBase: (v: number) => v / 0.45359237
        },
        {
          name: '盎司',
          symbol: 'oz',
          toBase: (v: number) => v * 0.028349523125,
          fromBase: (v: number) => v / 0.028349523125
        }
      ]
    },
    {
      name: '面積',
      units: [
        {
          name: '平方公里',
          symbol: 'km²',
          toBase: (v: number) => v * 1000000,
          fromBase: (v: number) => v / 1000000
        },
        {
          name: '公頃',
          symbol: 'ha',
          toBase: (v: number) => v * 10000,
          fromBase: (v: number) => v / 10000
        },
        {
          name: '平方公尺',
          symbol: 'm²',
          toBase: (v: number) => v,
          fromBase: (v: number) => v
        },
        {
          name: '平方公分',
          symbol: 'cm²',
          toBase: (v: number) => v / 10000,
          fromBase: (v: number) => v * 10000
        },
        {
          name: '平方英呎',
          symbol: 'ft²',
          toBase: (v: number) => v * 0.09290304,
          fromBase: (v: number) => v / 0.09290304
        },
        {
          name: '平方英吋',
          symbol: 'in²',
          toBase: (v: number) => v * 0.00064516,
          fromBase: (v: number) => v / 0.00064516
        },
        {
          name: '坪',
          symbol: '坪',
          toBase: (v: number) => v * 3.305785,
          fromBase: (v: number) => v / 3.305785
        }
      ]
    },
    {
      name: '體積',
      units: [
        {
          name: '立方公尺',
          symbol: 'm³',
          toBase: (v: number) => v,
          fromBase: (v: number) => v
        },
        {
          name: '立方公分',
          symbol: 'cm³',
          toBase: (v: number) => v / 1000000,
          fromBase: (v: number) => v * 1000000
        },
        {
          name: '公升',
          symbol: 'L',
          toBase: (v: number) => v / 1000,
          fromBase: (v: number) => v * 1000
        },
        {
          name: '毫升',
          symbol: 'mL',
          toBase: (v: number) => v / 1000000,
          fromBase: (v: number) => v * 1000000
        },
        {
          name: '加侖',
          symbol: 'gal',
          toBase: (v: number) => v * 0.003785411784,
          fromBase: (v: number) => v / 0.003785411784
        }
      ]
    }
  ];

  selectedCategory: UnitCategory = this.categories[0];
  fromUnit: Unit = this.selectedCategory.units[0];
  toUnit: Unit = this.selectedCategory.units[1];
  fromValue: number = 0;
  toValue: number = 0;

  commonConversions = [
    { from: this.categories[0].units[2], to: this.categories[0].units[6] }, // cm to in
    { from: this.categories[1].units[1], to: this.categories[1].units[3] }, // kg to lb
    { from: this.categories[2].units[2], to: this.categories[2].units[6] }, // m² to 坪
    { from: this.categories[3].units[2], to: this.categories[3].units[4] }  // L to gal
  ];

  convert() {
    if (this.fromValue === null || isNaN(this.fromValue)) {
      this.toValue = 0;
      return;
    }

    // 先轉換到基本單位，再轉換到目標單位
    const baseValue = this.fromUnit.toBase(this.fromValue);
    this.toValue = this.toUnit.fromBase(baseValue);
  }

  usePreset(preset: { from: Unit, to: Unit }) {
    // 找到對應的類別
    const category = this.categories.find(c => 
      c.units.includes(preset.from) && c.units.includes(preset.to)
    );
    if (category) {
      this.selectedCategory = category;
      this.fromUnit = preset.from;
      this.toUnit = preset.to;
      this.convert();
    }
  }
}
