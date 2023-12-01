<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClientCreateRequest;
use App\Http\Requests\ClientUpdateRequest;
use App\Http\Resources\ClientCollection;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Get client by idClient.
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
     * Create a new client.
     *
     * @param  ClientCreateRequest  $request
     * @return JsonResponse
     */
    public function create(ClientCreateRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            $client = new Client($data);
            $client->save();

            return (new ClientResource($client))->response()->setStatusCode(201);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                "errors" => [
                    "message" => [
                        "Error creating client."
                    ]
                ]
            ])->setStatusCode(500);
        }
    }

    /**
     * Search clients with 'name', 'email' and 'phone' filters using
     * 'like' query, and paginate the results.
     *
     * @param  Request  $request
     * @return ClientCollection
     */
    public function search(Request $request): ClientCollection
    {
        try {
            $page = $request->input('page', 1);
            $size = $request->input('size', 10);

            $clients = Client::where(function (Builder $builder) use ($request) {
                $name = $request->input('name');
                $email = $request->input('email');
                $phone = $request->input('phone');

                if ($name) {
                    $builder->where('name', 'like', "%{$name}%");
                }

                if ($email) {
                    $builder->where('email', 'like', "%{$email}%");
                }

                if ($phone) {
                    $builder->where('phone', 'like', "%{$phone}%");
                }
            });

            $clients = $clients->paginate(perPage: $size, page: $page);

            return new ClientCollection($clients);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                "errors" => [
                    "message" => [
                        "Error searching clients."
                    ]
                ]
            ])->setStatusCode(500);
        }
    }

    /**
     * Get a client by id.
     *
     * @param  int  $id
     * @return ClientResource
     *
     * @throws HttpResponseException
     */
    public function getById(int $id): ClientResource
    {
        try {
            $client = $this->getClient($id);

            return new ClientResource($client);
        } catch (\Exception $e) {
            report($e);

            // check if exception is instance of HttpResponseException
            if ($e instanceof HttpResponseException) {
                throw $e;
            }

            return response()->json([
                "errors" => [
                    "message" => [
                        "Error getting client by ID."
                    ]
                ]
            ])->setStatusCode(500);
        }
    }

    /**
     * Update a client by id.
     *
     * @param  int  $id
     * @param  ClientUpdateRequest  $request
     * @return ClientResource
     *
     * @throws HttpResponseException
     */
    public function update(int $id, ClientUpdateRequest $request): ClientResource
    {
        try {
            $client = $this->getClient($id);

            $data = $request->validated();
            $client->fill($data);
            $client->save();

            return new ClientResource($client);
        } catch (\Exception $e) {
            report($e);

            // check if exception is instance of HttpResponseException
            if ($e instanceof HttpResponseException) {
                throw $e;
            }

            return response()->json([
                "errors" => [
                    "message" => [
                        "Error updating client."
                    ]
                ]
            ])->setStatusCode(500);
        }
    }

    /**
     * Delete a client by id.
     *
     * @param  int  $id
     * @return JsonResponse
     *
     * @throws HttpResponseException
     */
    public function delete(int $id): JsonResponse
    {
        try {
            $client = $this->getClient($id);

            $client->delete();

            return response()->json([
                "message" => "Client successfully deleted."
            ])->setStatusCode(200);
        } catch (\Exception $e) {
            report($e);

            // check if exception is instance of HttpResponseException
            if ($e instanceof HttpResponseException) {
                throw $e;
            }

            return response()->json([
                "errors" => [
                    "message" => [
                        "Error deleting client."
                    ]
                ]
            ])->setStatusCode(500);
        }
    }
}
