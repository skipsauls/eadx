({
	createCell: function(component, val) {
        var cell = document.createElement("td");
        cell.setAttribute("role", "gridcell");
        var div = document.createElement("div");
        div.classList.add("slds-truncate");
        div.innerHTML = '' + val;
        cell.appendChild(div);
        return cell;
    },
    
    createRow: function(component, idx, k, obj) {
        var row = document.createElement("tr");
        var cell = null;
        
        cell = this.createCell(component, idx);
        row.appendChild(cell);
        row.setAttribute("data-index", idx);
        
        cell = this.createCell(component, k);
        row.appendChild(cell);
        row.setAttribute("data-key", k);
        
        cell = this.createCell(component, typeof obj[k]);
        row.appendChild(cell);
        row.setAttribute("data-type", typeof obj[k]);
        
        cell = this.createCell(component, obj[k]);
        row.appendChild(cell);
        row.setAttribute("data-val", obj[k]);

        return row;
    }
})