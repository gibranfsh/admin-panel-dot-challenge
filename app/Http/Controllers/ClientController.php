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
     * Create a new client.
     *
     * @param  ClientCreateRequest  $request
     * @return JsonResponse
     */
    public function create(ClientCreateRequest $request): JsonResponse
    {
        $data = $request->validated();

        $client = new Client($data);
        $client->save();

        return (new ClientResource($client))->response()->setStatusCode(201);
    }

    /**
     * Search clients with 'name', 'email' and 'phone' filters using
     * like query, and paginate the results.
     *
     * @param  Request  $request
     * @return ClientCollection
     */
    public function search(Request $request): ClientCollection
    {
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
    }

    /**
     * Get a client by id.
     *
     * @param  int  $id
     * @return ClientResource
     */
    public function getById(int $id): ClientResource
    {
        $client = Client::where('id', $id)->first();

        if (!$client) {
            throw new HttpResponseException(response()->json([
                "errors" => [
                    "message" => [
                        "Client not found."
                    ]
                ]
            ])->setStatusCode(404));
        };

        return new ClientResource($client);
    }

    /**
     * Update a client by id.
     *
     * @param  int  $id
     * @param  ClientUpdateRequest  $request
     * @return ClientResource
     */
    public function update(int $id, ClientUpdateRequest $request): ClientResource
    {
        $client = Client::where('id', $id)->first();

        if (!$client) {
            throw new HttpResponseException(response()->json([
                "errors" => [
                    "message" => [
                        "Client not found."
                    ]
                ]
            ])->setStatusCode(404));
        };

        $data = $request->validated();
        $client->fill($data);
        $client->save();

        return new ClientResource($client);
    }

    /**
     * Delete a client by id.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function delete(int $id): JsonResponse
    {
        $client = Client::where('id', $id)->first();

        if (!$client) {
            throw new HttpResponseException(response()->json([
                "errors" => [
                    "message" => [
                        "Client not found."
                    ]
                ]
            ])->setStatusCode(404));
        };

        $client->delete();

        return response()->json([
            "message" => "Client successfully deleted."
        ])->setStatusCode(204);
    }
}
