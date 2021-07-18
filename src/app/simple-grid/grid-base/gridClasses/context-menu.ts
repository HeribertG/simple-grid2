export class ContextMenu {
   public hasChildren = false;
   public HasParend = false;
   constructor(public id: number, public name: string, public isEnabled: boolean, public key: string, public isSeparation: boolean, private children: ContextMenu[]|undefined = undefined, public parent : Array<ContextMenu>|undefined = undefined) {
      if (children && children.length > 0) { this.hasChildren = true; }
      if(parent ){ this.HasParend = true;}
   }
}
