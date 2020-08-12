export interface dataProps {
  dataList: { name: string; event: () => void }[];
}
export interface DropdownMenuProps extends dataProps {
  num: number;
}
