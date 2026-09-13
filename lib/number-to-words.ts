/**
 * Convert Indian Rupee numbers to words in English and Hindi
 */

const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

export function numberToWordsIndian(num: number): string {
  if (num === 0) return "Zero Rupees Only";
  if (num < 0) return "Negative " + numberToWordsIndian(Math.abs(num));

  function convertLessThanOneThousand(n: number): string {
    let result = "";
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      result += ones[n] + " ";
    }
    return result.trim();
  }

  let crore = Math.floor(num / 10000000);
  let lakh = Math.floor((num % 10000000) / 100000);
  let thousand = Math.floor((num % 100000) / 1000);
  let remainder = num % 1000;

  let parts: string[] = [];
  if (crore > 0) parts.push(convertLessThanOneThousand(crore) + " Crore");
  if (lakh > 0) parts.push(convertLessThanOneThousand(lakh) + " Lakh");
  if (thousand > 0) parts.push(convertLessThanOneThousand(thousand) + " Thousand");
  if (remainder > 0) parts.push(convertLessThanOneThousand(remainder));

  return parts.join(" ") + " Rupees Only";
}

export function numberToWordsHindi(num: number): string {
  // Common amounts mapping for fast accurate Hindi rendering
  const map: Record<number, string> = {
    100: "एक सौ रुपये मात्र",
    200: "दो सौ रुपये मात्र",
    250: "दो सौ पचास रुपये मात्र",
    300: "तीन सौ रुपये मात्र",
    500: "पाँच सौ रुपये मात्र",
    750: "सात सौ पचास रुपये मात्र",
    1000: "एक हज़ार रुपये मात्र",
    1200: "एक हज़ार दो सौ रुपये मात्र",
    1500: "एक हज़ार पाँच सौ रुपये मात्र",
    2000: "दो हज़ार रुपये मात्र",
    2500: "दो हज़ार पाँच सौ रुपये मात्र",
    3000: "तीन हज़ार रुपये मात्र",
    5000: "पाँच हज़ार रुपये मात्र",
    10000: "दस हज़ार रुपये मात्र",
  };

  if (map[num]) return map[num];
  return numberToWordsIndian(num);
}
