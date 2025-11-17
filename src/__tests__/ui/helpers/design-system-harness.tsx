import DesignSystem, { modalGroups, modalShowcases } from "@/components/DesignSystem";

export const createDesignSystemTree = () => DesignSystem();

export const getModalMetadata = () =>
  modalShowcases.map(({ id, group, title, path, description }) => ({
    id,
    group,
    title,
    path,
    description: description ?? null,
  }));

export const getModalGroups = () => [...modalGroups];

export const getModalCount = () => modalShowcases.length;

export const getModalShowcases = () => modalShowcases;
