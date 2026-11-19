import { ArrowLeft, ArrowRight } from "lucide-react";

function NextStep({ LoR, Text, onClick, isDisabled = false }) {
    const Icon = LoR ? ArrowLeft : ArrowRight;

    const baseClasses = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const stateClasses = isDisabled
        ? "border border-gray-200 bg-gray-100 text-gray-400 shadow-none"
        : LoR
            ? "border border-orange-200 bg-white text-orange-600 shadow-md shadow-orange-500/10 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 hover:shadow-lg hover:shadow-orange-500/15 active:translate-y-0 active:scale-[0.98]"
            : "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/30 active:translate-y-0 active:scale-[0.98]";

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={onClick}
            aria-label={Text}
            className={`${baseClasses} ${stateClasses}`}
        >
            {LoR && <Icon className="size-4" aria-hidden="true" />}
            <span>{Text}</span>
            {!LoR && <Icon className="size-4" aria-hidden="true" />}
        </button>
    );
}

export default NextStep;
