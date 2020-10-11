import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetTransactionRequest } from '../../models/transaction/get-transaction-request.model';
import { ModelResponse } from '../../models/model-response.model';
import { PagingList } from '../../models/paging-list.model';
import { TransactionModel } from '../../models/transaction/transaction.model';
import { API } from '../../helpers/api-decorator';
import { IdModelRequest } from '../../models/id-model-request.model';
import { AddTransactionRequest } from '../../models/transaction/add-transaction-request.model';
import { ApiResponse } from '../../models/api-response.model';
import { TransactionFileRequest } from '../../models/transaction/transaction-file-request.model';

@Injectable()
export class APITransactionService {

  constructor(
    private _httpClient: HttpClient,
  ) {

  }

  // <response code="200">Transaction list</response>
  @API<ModelResponse<PagingList<TransactionModel>>>()
  public async getTransactions(request: GetTransactionRequest): Promise<ModelResponse<PagingList<TransactionModel>>> {

    let params = new HttpParams();
    if (request.pn != null)       params = params.set("pn", request.pn.toString());
    if (request.ps != null)       params = params.set("ps", request.ps.toString());
    if (request.sort != null)     params = params.set("sort", request.sort);
    if (request.sortDir != null)  params = params.set("sortDir", request.sortDir);
    if (request.find != null)     params = params.set("find", request.find);
    if (request.status != null)   params = params.set("status", request.status.toString());
    if (request.type != null)     params = params.set("type", request.type.toString());

    let response = new ModelResponse<PagingList<TransactionModel>>();
    response.model = await this._httpClient.get<PagingList<TransactionModel>>('api/transaction', { params: params }).toPromise();
    return response;
  }

  // <response code="200">Transactions added</response>
  // <response code="400">File is empty or bad</response>
  @API<ApiResponse>()
  public async addTransactions(request: TransactionFileRequest<FormData>): Promise<ApiResponse> {
    let response = new ApiResponse();
    await this._httpClient.post('api/transaction', request).toPromise();
    return response;
  }

  // <response code="200">Transaction edited</response>
  // <response code="404">Transaction doesnt exist</response>
  @API<ModelResponse<TransactionModel>>()
  public async editTransaction(request: IdModelRequest<AddTransactionRequest>): Promise<ModelResponse<TransactionModel>> {
    let response = new ModelResponse<TransactionModel>();
    response.model = await this._httpClient.put<TransactionModel>(`api/transaction/${request.id}`, request.model).toPromise();
    return response;
  }

  // <response code="200">Transaction deleted</response>
  // <response code="404">Transaction doesnt exist</response>
  @API<ApiResponse>()
  public async deleteTransaction(request: number): Promise<ApiResponse> {
    let response = new ApiResponse();
    await this._httpClient.delete<any>(`api/transaction/${request}`).toPromise();
    return response;
  }
}
