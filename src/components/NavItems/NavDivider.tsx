const NavDivider = ({ title }) => {
    return (
        <div className="px-[11px] pt-[22px] pb-[9px]">
            <span className="text-[11px] font-semibold tracking-[0.07em] uppercase text-[#64748b] dark:text-gray-500">{title}</span>
        </div>
    );
};

export default NavDivider;