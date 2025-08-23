import { signIn } from "@/auth";

import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

import { t } from "@/utils/translations";
import Button from "@/components/ui/Button";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("keycloak");
      }}
    >
      {/* Desktop version: full text button */}
      <div className="hidden md:block">
        <Button type="submit">
          <div className="flex items-center gap-2">
            <span>{t("userPanel.signIn")}</span>

            <div className="mx-1 h-4 w-px bg-gray-300"></div>

            <span>{t("userPanel.register")}</span>
          </div>
        </Button>
      </div>

      {/* Mobile version: icon-only button with a11y support */}
      <div className="block md:hidden">
        <button
          className="p-2"
          aria-label={`${t("userPanel.signIn")} / ${t("userPanel.register")}`}
          type="submit"
        >
          <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
        </button>
      </div>
    </form>
  );
}
