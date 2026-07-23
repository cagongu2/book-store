export const ITEMS_PER_PAGE = {
    DEFAULT: "/ trang",
    SHORT: "trang",
}

export const PAGE_SIZE_OPTIONS = ["10", "20", "50", "100"];

export const showTotalVi = (totalCount: number, type: string) => {
    return (
        <div className="font-normal! leading-[150%]! w-full text-black/88! text-sm!">
            Tổng cộng {totalCount} {type}
        </div>
    );
};