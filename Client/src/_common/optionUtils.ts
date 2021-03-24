// Helper
const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

// Turn enum into array
export const ToOptionArray = (enumme: any) => {
  return Object.keys(enumme)
    .filter(StringIsNumber)
    .map((key) => {
      return {
        label: enumme[key],
        value: Number(key) // force as number
      };
    });
};
