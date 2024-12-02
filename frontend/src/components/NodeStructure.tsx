import { ActivityType, CreateProjectApiRes } from "@/types";
import { useEffect, useRef, useState, type FC } from "react";
import * as d3 from "d3";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useListProjectsQuery } from "@/services";

interface NodeStructureProps {
  data: CreateProjectApiRes;
}

interface HierarchyNodeData {
  name: string;
  status?: ActivityType | null;
  children?: HierarchyNodeData[];
}

const NodeStructure: FC<NodeStructureProps> = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const { data: projectsList, isFetching: projectsLoading } =
    useListProjectsQuery();

  const transformToHierarchy = (
    projectsData?: CreateProjectApiRes
  ): HierarchyNodeData => {
    if (!projectsData || projectsData.length === 0) {
      return { name: "root" };
    }

    return {
      name: "root",
      children: projectsData.map(project => ({
        name: project.projectName,
        status: project.status,
        children: [
          {
            name: "Activities",
            children:
              project.activities?.map(activity => ({
                name: activity.activityName,
                status: activity.status,
                data: activity,
              })) || [],
          },
          {
            name: "Documents",
            children:
              project.documents?.map(document => ({
                name: document.documentName,
                data: document,
              })) || [],
          },
          {
            name: "Members",
            children:
              project.members?.map(member => ({
                name: member.name,
                data: member,
              })) || [],
          },
        ],
      })),
    };
  };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderTree = () => {
    if (!svgRef.current || !containerRef.current || !projectsList) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const hierarchyData = transformToHierarchy(projectsList);
    const container = containerRef.current;

    const margin = { top: 20, right: 200, bottom: 20, left: 120 };
    const containerWidth = container.clientWidth;
    const width = containerWidth - margin.right - margin.left;

    const root = d3.hierarchy(hierarchyData);
    const nodeCount = root.descendants().length;
    const nodeHeight = 50;
    const height = Math.max(
      600,
      nodeCount * nodeHeight + margin.top + margin.bottom
    );

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.right + margin.left)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const treeLayout = d3
      .tree<HierarchyNodeData>()
      .size([height, width])
      .separation(() => 1);

    treeLayout(root);

    svg
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d => `
          M${d.source.y},${d.source.x}
          C${(d.source.y ?? 0) + 50},${d.source.x}
           ${(d.target.y ?? 0) - 50},${d.target.x}
           ${d.target.y},${d.target.x}
        `
      )
      .style("fill", "none")
      .style("stroke", "#3182bd")
      .style("stroke-width", "2px");

    const node = svg
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    node
      .append("circle")
      .attr("r", 10)
      .style("fill", d => {
        if (d.depth === 1) {
          return "orange";
        }
        if (d.data.name === "Activities") {
          return "lightblue";
        } else if (d.data.name === "Documents") {
          return "lightgreen";
        } else if (d.data.name === "Members") {
          return "lightpink";
        }
        return "#fff";
      })
      .style("stroke", "#3182bd")
      .style("stroke-width", "2px")
      .on("click", (_event, d) => {
        setSelectedNode(d.data);
      });

    node
      .append("text")
      .attr("dy", d => (d.children ? "1.5em" : "0.35em"))
      .attr("x", d => (d.children ? 30 : 13))
      .style("text-anchor", d => (d.children ? "end" : "start"))
      .attr("paint-order", "stroke")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .text(d => d.data.name);
  };

  useEffect(() => {
    if (!projectsLoading) {
      renderTree();
    }
  }, [projectsList, projectsLoading]);

  if (projectsLoading) {
    return <CircularProgress size={75} />;
  }

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box
        ref={containerRef}
        sx={{
          border: "1px solid #ccc",
          borderRadius: 4,
          flex: 1,
          height: "1200px",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <svg ref={svgRef} style={{ minWidth: "100%" }}></svg>
      </Box>

      {selectedNode && (
        <Card sx={{ width: 300 }}>
          <CardContent>
            <Button
              size="small"
              color="primary"
              onClick={() => setSelectedNode(null)}
              variant="outlined"
              sx={{ ml: "auto", display: "block" }}
            >
              Close
            </Button>
            <Typography variant="h6" mb={2}>
              Node Details
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedNode.name}
                </Typography>
              </Grid>
              {selectedNode.status && (
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Status:</strong> {selectedNode.status}
                  </Typography>
                </Grid>
              )}
              {selectedNode.data && (
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Details:</strong>
                  </Typography>
                  <pre
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {JSON.stringify(selectedNode.data, null, 2)}
                  </pre>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default NodeStructure;
