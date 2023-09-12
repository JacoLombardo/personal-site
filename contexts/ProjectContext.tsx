import { Project } from "@/types/project";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export type ProjectContextValue = {
  projects: Project[] | undefined;
  setProjects: Dispatch<SetStateAction<Project[] | undefined>>;
  getProjects: Function;
  loader: boolean;
  setLoader: Dispatch<SetStateAction<boolean>>;
};
const initialFileContext: ProjectContextValue = {
  projects: undefined,
  setProjects: () => {},
  getProjects: () => {},
  loader: true,
  setLoader: () => {},
};

// ** Create Context
export const ProjectContext =
  createContext<ProjectContextValue>(initialFileContext);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[] | undefined>(undefined);
  const [loader, setLoader] = useState<boolean>(true);

  const getProjects = () => {
    var requestOptions = {
      headers: new Headers(),
    };

    fetch("/api/get-projects", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setProjects(result);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        getProjects,
        loader,
        setLoader,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
