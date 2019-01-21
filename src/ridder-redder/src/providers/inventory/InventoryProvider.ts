import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/AuthProvider';
import { InventoryItem } from '../../models/InventoryItem';
import { Observable } from 'rxjs';
import { ItemType } from '../../models/ItemType';
import { ItemImage } from '../../models/ItemImage';
import { AddInventoryItemDto } from '../../dtos/AddInventoryItemDto';
import { Landmark } from '../../models/Landmark';
import { Knight } from '../../models/Knight';

/*
  Generated class for the InventoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
 */
@Injectable()
export class InventoryProvider {

    public ItemTypes: ItemType[];
    public ItemImages: ItemImage[];

    constructor(public http: HttpClient, private auth: AuthProvider) {
        console.log('Hello InventoryProvider Provider');

        this.getItemImages().subscribe(images => {
            this.ItemImages = images;
            // console.log(this.ItemImages);
        })
        this.getItemTypes().subscribe(types => {
            this.ItemTypes = types;
            // console.log(this.ItemTypes);
        })
    }

    public getItemImageById(id: number): ItemImage {
        if (!this.ItemImages)
            this.ItemImages = [];

        this.ItemImages.forEach(img => {
            if (img.itemImageId == id)
                return img;
        })

        return null;
    }

    public getItemImageByPath(path: string): ItemImage {
        if (!this.ItemImages)
            this.ItemImages = [];

        this.ItemImages.forEach(img => {
            if (img.path.includes(path))
                return img;
        });

        return null;
    }

    public getRandomImage(): ItemImage {
        let randomIndex = Math.floor(Math.random() * this.ItemImages.length);
        return this.ItemImages[randomIndex];
    }

    public getItemTypeById(id: number): ItemType{
        if (!this.ItemTypes)
            this.ItemTypes = [];

        this.ItemTypes.forEach(type => {
            if (type.itemTypeId == id)
                return type;
        });

        return null;
    }

    public getItemTypeByName(name: string): ItemType {
        if (!this.ItemTypes)
            this.ItemTypes = [];

        this.ItemTypes.forEach(type => {
            if (type.itemTypeName.includes(name))
                return type;
        });

        return null;
    }

    public getItemImages(): Observable<ItemImage[]> {
        // console.log(`${this.baseUrl}/inventory/images`);
        return this.http.get<ItemImage[]>(`/inventory/images`);
    }

    public getItemTypes(): Observable<ItemType[]> {
        // console.log(`${this.baseUrl}/inventory/types`);
        return this.http.get<ItemType[]>(`/inventory/types`);
    }

    public getInventory(): Observable<InventoryItem[]> {
        return this.http.get<InventoryItem[]>(`/inventory/${this.auth.AuthId}`);
    }

    public addToInventory(item: AddInventoryItemDto): Observable<InventoryItem> {
        return this.http.post<InventoryItem>(`/inventory`, item);
    }

    public updateInventoryItem(itemId: number, item: InventoryItem): Observable<InventoryItem> {
        return this.http.put<InventoryItem>(`/inventory/${itemId}`, item);
    }

    public deleteInventoryItem(itemId: number): Observable<Boolean> {
        return this.http.delete<Boolean>(`/inventory/${itemId}`);
    }

    /*
        Transfers some an amount of knights to the given landmark
        PARAMS: item:       The InventoryItem to convert to a knight, which we will substract the given level/amount from
                itemId:     The ID of the InventoryItem
                amount:     The amount of knights to add to the landmark, also known as the level
                landmark:   The landmark to add the knights to
     */
    public transferItemToLandmark(item: InventoryItem, amount: number, landmark: Landmark): Observable<Landmark> {
        // Update given landmark to include knights to defend it with

        // Create a new knight with given color, level and owner
        let knight: Knight = {
            knightId: undefined,
            colour: "" + item.itemImage.itemImageId,
            level: amount,
            authId: this.auth.AuthId,
            landmarkId: landmark.landmarkId
        }
        console.log(landmark);
        if(landmark.knights){
            landmark.knights.push(knight);
        }
        else{
            landmark.knights = [knight];
        }
        landmark.owner = this.auth.AuthId;

        // Update the landmark with its owner and defender(s)
        var tmplandmark:Landmark;
        tmplandmark = JSON.parse(JSON.stringify(landmark));
        console.log(tmplandmark);
        tmplandmark.marker = undefined;
        console.log(JSON.stringify(tmplandmark));
        return this.http.put<Landmark>(`/Landmark/${tmplandmark.landmarkId}`, tmplandmark)
        .flatMap(landmarkData => {
            tmplandmark = landmarkData;
            tmplandmark.marker = landmark.marker;
            console.log(landmarkData);
            // Update the player's inventory to substract the amount of knights
            item.amount -= amount;
            console.log("post-add inventory item");
            console.log(item);
            return this.http.put<InventoryItem>(`/Inventory/${item.inventoryItemId}`, item)})
        .map(itemData => {
            console.log("after subtracting items:");
            console.log(itemData);
            return tmplandmark;
        }, error => console.log(error));
    }
}
