$(function(){

  $('#drag-and-drop-zone').dmUploader({ //
    url: 'server/upload.php',
    maxFileSize: 3000000, // 3 Megs
    fileCount: 5,
    allowedTypes: 'image/*',
    extFilter: ["jpg", "jpeg","png"],
    onDragEnter: function(){
      // Happens when dragging something over the DnD area
      this.addClass('active');
    },
    onDragLeave: function(){
      // Happens when dragging something OUT of the DnD area
      this.removeClass('active');
    },
    onInit: function(){
      // Plugin is ready to use
      ui_add_log('Penguin initialized :)', 'info');
    },
    onComplete: function(){
      // All files in the queue are processed (success or error)
      ui_add_log('All pending tranfers finished');
    },
    onNewFile: function(id, file){
      // When a new file is added using the file selector or the DnD area
      ui_add_log('New file added #' + id);
      ui_multi_add_file(id, file);

      if (typeof FileReader !== "undefined"){
        var reader = new FileReader();
        var img = $('#uploaderFile' + id).find('img');
        
        reader.onload = function (e) {
          img.attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
      }
    },
    onBeforeUpload: function(id){
      // about tho start uploading a file
      ui_add_log('Starting the upload of #' + id);
      ui_multi_update_file_progress(id, 0, '', true);
      ui_multi_update_file_status(id, 'uploading', 'Uploading...');
    },
    onUploadProgress: function(id, percent){
      // Updating file progress
      ui_multi_update_file_progress(id, percent);
    },
    onUploadSuccess: function(id, data){
      // A file was successfully uploaded
      ui_add_log('Server Response for file #' + id + ': ' + JSON.stringify(data));
      ui_add_log('Upload of file #' + id + ' COMPLETED', 'success');
      ui_multi_update_file_status(id, 'success', 'Upload Complete');
      ui_multi_update_file_progress(id, 100, 'success', false);

      ui_multi_update_file_name(id, data);

    },
    onUploadError: function(id, xhr, status, message){
      ui_multi_update_file_status(id, 'danger', message);
      ui_multi_update_file_progress(id, 0, 'danger', false);  
    },
    onFallbackMode: function(){
      // When the browser doesn't support this plugin :(
      swal("Error!", "Plugin cant be used here, running Fallback callback", "error");
      ui_add_log('Plugin cant be used here, running Fallback callback', 'danger');
    },
    onFileSizeError: function(file){
      swal("Error!", "Cannot be added: size excess limit", "error");
      ui_add_log('File \'' + file.name + '\' cannot be added: size excess limit', 'danger');
    },
    onFileTypeError: function(file){
      swal("Error!", "Cannot be added: must be an image (type error)", "error");
      ui_add_log('File \'' + file.name + '\' cannot be added: must be an image (type error)', 'danger');
    },
    onFileExtError: function(file){
      swal("Error!", "Cannot be added: must be an image (extension error)", "error");
      ui_add_log('File \'' + file.name + '\' cannot be added: must be an image (extension error)', 'danger');
    },
    onFileCountExceed: function(file) {
      swal("Error!", "Cannot be added: file count exceeded, only 5 files can be added", "error");
    }
  });

  //delete uploaded image

  $('#files').on('click', 'a.delete-img', function(evt){
    evt.preventDefault();

    var img = $(this).closest('li.img');
    var filename = $(this).data('filename');

    $.ajax({
      url: 'server/delete.php?file='+filename,
      type: 'GET',
      success: function(data) {
          console.log(data)
      },
      error: function(err) {
          console.log(err)
      }
    });

    img.remove();

    $('#drag-and-drop-zone').dmUploader('delete');

  });


});
