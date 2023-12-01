<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectCreateRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Client;
use App\Models\Project;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Get client by client ID.
     *
     * @param  int  $idClient
     * @return Client
     *
     * @throws HttpResponseException
     */
    private function getClient(int $idClient): Client
    {
        $client = Client::where('id', $idClient)->first();

        if (!$client) {
            throw new HttpResponseException(response()->json([
                "errors" => [
                    "message" => [
                        "Client not found."
                    ]
                ]
            ])->setStatusCode(404));
        };

        return $client;
    }

    /**
     * Get a project by client ID and project ID.
     *
     * @param  int  $idClient
     * @param  int  $idProject
     * @return Project
     *
     * @throws HttpResponseException
     */
    private function getProject(Client $client, int $idProject): Project
    {
        $project = Project::where('client_id', $client->id)->where('id', $idProject)->first();

        if (!$project) {
            throw new HttpResponseException(response()->json([
                "errors" => [
                    "message" => [
                        "Project not found."
                    ]
                ]
            ])->setStatusCode(404));
        };

        return $project;
    }

    /**
     * Create a new project.
     *
     * @param  int  $idClient
     * @param  ProjectCreateRequest  $request
     * @return JsonResponse
     *
     * @throws HttpResponseException
     */
    public function create(int $idClient, ProjectCreateRequest $request): JsonResponse
    {
        try {
            $client = $this->getClient($idClient);

            $data = $request->validated();
            $project = new Project($data);
            $project->client_id = $client->id;
            $project->save();

            return (new ProjectResource($project))->response()->setStatusCode(201);
        } catch (\Exception $e) {
            report($e);

            // check if exception is instance of HttpResponseException
            if ($e instanceof HttpResponseException) {
                throw $e;
            }

            return response()->json([
                "errors" => [
                    "message" => ["An error occurred during project creation."]
                ]
            ], 500);
        }
    }

    /**
     * Get all projects by client ID.
     *
     * @param  int  $idClient
     * @return JsonResponse
     *
     * @throws HttpResponseException
     */
    public function getAll(int $idClient): JsonResponse
    {
        try {
            $client = $this->getClient($idClient);

            $projects = Project::where('client_id', $client->id)->get();

            return response()->json([
                "data" => ProjectResource::collection($projects)
            ])->setStatusCode(200);
        } catch (\Exception $e) {
            report($e);

            // check if exception is instance of HttpResponseException
            if ($e instanceof HttpResponseException) {
                throw $e;
            }

            return response()->json([
                "errors" => [
                    "message" => ["An error occurred while fetching projects."]
                ]
            ], 500);
        }
    }

    /**
     * Get a specific project by client ID and project ID.
     *
     * @param  int  $idClient
     * @param  int  $idProject
     *
     * @return ProjectResource
     *
     * @throws HttpResponseException
     */
    public function get(int $idClient, int $idProject): ProjectResource
    {
        try {
            $client = $this->getClient($idClient);
            $project = $this->getProject($client, $idProject);

            return new ProjectResource($project);
        } catch (\Exception $e) {
            report($e);

            // check if exception is instance of HttpResponseException
            if ($e instanceof HttpResponseException) {
                throw $e;
            }

            return response()->json([
                "errors" => [
                    "message" => ["An error occurred while fetching project."]
                ]
            ], 500);
        }
    }

    /**
     * Update a specific project by client ID and project ID.
     *
     * @param  int  $idClient
     * @param  int  $idProject
     * @param  ProjectUpdateRequest  $request
     *
     * @return ProjectResource
     *
     * @throws HttpResponseException
     */
    public function update(int $idClient, int $idProject, ProjectUpdateRequest $request): ProjectResource
    {
        try {
            $client = $this->getClient($idClient);
            $project = $this->getProject($client, $idProject);

            $data = $request->validated();
            $project->fill($data);
            $project->save();

            return new ProjectResource($project);
        } catch (\Exception $e) {
            report($e);

            // check if exception is instance of HttpResponseException
            if ($e instanceof HttpResponseException) {
                throw $e;
            }

            return response()->json([
                "errors" => [
                    "message" => ["An error occurred during project update."]
                ]
            ], 500);
        }
    }

    /**
     * Delete a specific project by client ID and project ID.
     *
     * @param  int  $idClient
     * @param  int  $idProject
     *
     * @return JsonResponse
     *
     * @throws HttpResponseException
     */
    public function delete(int $idClient, int $idProject): JsonResponse
    {
        try {
            $client = $this->getClient($idClient);
            $project = $this->getProject($client, $idProject);

            $project->delete();

            return response()->json([
                "message" => "Project successfully deleted."
            ])->setStatusCode(200);
        } catch (\Exception $e) {
            report($e);

            // check if exception is instance of HttpResponseException
            if ($e instanceof HttpResponseException) {
                throw $e;
            }
            
            return response()->json([
                "errors" => [
                    "message" => ["An error occurred during project deletion."]
                ]
            ], 500);
        }
    }
}
