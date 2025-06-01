// src/__tests__/utils.test.ts

import { cn } from '../lib/utils'; // Import the correct function

describe('cn', () => { // Describe the correct function
  it('should merge class names correctly', () => { // Update the test description
    // Write your test for the cn function here
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2'); // Replace with the expected output for cn
  });
});
