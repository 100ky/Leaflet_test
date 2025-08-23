/**
 * About page for the Combustion web application
 *
 * This page provides information about the project, its purpose, and the team.
 * The title is localized using the translation utility.
 *
 * Author: Garbage Collectors Headquarters
 * Date: July 2025
 */
import { t } from "@/utils/translations";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            {t("navigation.about")}
          </h1>
        </div>
      </div>
    </div>
  );
}
